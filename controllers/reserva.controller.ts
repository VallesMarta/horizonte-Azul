import { NextResponse } from "next/server";
import { ReservaModel } from "@/models/reserva.model";
import { PasajeroModel } from "@/models/pasajero.model";
import { TarjetaModel } from "@/models/tarjeta.model";
import { VueloModel } from "@/models/vuelo.model";
import { UsuarioModel } from "@/models/usuario.model";
import { ViajeServicioModel } from "@/models/viaje-servicio.model";
import { obtenerSesion, validarAdmin } from "@/lib/auth-utils";
import { emailReservaConfirmada } from "@/lib/email/emailActions";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import {
  CheckoutPayload,
  ReservaServicioInput,
  ReservaCreateInput,
} from "@/models/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key");

export const ReservaController = {
  // POST /api/reservas — procesar checkout completo
  async procesarCheckout(req: Request) {
    const sesion = await obtenerSesion(req);
    if (!sesion)
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión para realizar una reserva" },
        { status: 401 },
      );

    try {
      const body: CheckoutPayload = await req.json();
      const {
        vuelosIds, // Array de { vuelo_id, tipo }
        pasajeros, // Array de objetos con datos de pasajeros
        extras, // Array de extras seleccionados
        metodo, // 'tarjeta', 'transferencia', etc.
        paymentMethodId, // Token de Stripe
        precioTotal, // Precio final calculado en el front
        guardarTarjeta,
      } = body;

      if (!vuelosIds?.length || !pasajeros?.length || !precioTotal) {
        return NextResponse.json(
          { ok: false, error: "Faltan datos obligatorios" },
          { status: 400 },
        );
      }

      const numPasajeros = pasajeros.length;
      const codigoGrupo = uuidv4();
      const usuarioId = Number(sesion.id);

      // 2. Verificar plazas (Antes de cobrar)
      for (const item of vuelosIds) {
        const vuelo = await VueloModel.getById(item.vuelo_id);
        if (!vuelo || vuelo.plazasDisponibles < numPasajeros) {
          return NextResponse.json(
            {
              ok: false,
              error: `Lo sentimos, ya no quedan plazas en el vuelo ${item.vuelo_id}`,
            },
            { status: 409 },
          );
        }
      }

      // 3. Lógica de Pago con Stripe
      if (metodo === "tarjeta") {
        if (!paymentMethodId) {
          return NextResponse.json(
            { ok: false, error: "Falta el método de pago" },
            { status: 400 },
          );
        }

        try {
          const usuarioBD = await UsuarioModel.getById(usuarioId);
          let stripeCustomerId = usuarioBD.stripe_customer_id;

          // A. Asegurar Cliente en Stripe
          if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
              email: sesion.email,
              name: sesion.username,
            });
            stripeCustomerId = customer.id;
            await UsuarioModel.actualizarStripeCustomerId(
              usuarioId,
              stripeCustomerId,
            );
          }

          // B. Obtener detalles de la tarjeta desde Stripe (Seguridad total)
          const pm = await stripe.paymentMethods.retrieve(paymentMethodId);

          // C. Si el usuario marcó "Guardar", usamos nuestro nuevo Modelo
          if (guardarTarjeta) {
            try {
              // Adjuntar en Stripe
              await stripe.paymentMethods.attach(paymentMethodId, {
                customer: stripeCustomerId,
              });

              // Guardar en nuestra DB con los nuevos campos (exp_month, exp_year, etc.)
              await TarjetaModel.create({
                usuarioId: usuarioId,
                paymentMethodId: pm.id,
                brand: pm.card?.brand || "unknown",
                last4: pm.card?.last4 || "0000",
                expMonth: pm.card?.exp_month || 0,
                expYear: pm.card?.exp_year || 0,
                nombreTitular: pm.billing_details?.name,
              });
            } catch (e: any) {
              console.log(
                "Aviso: La tarjeta ya estaba vinculada o error menor al guardar",
              );
            }
          }

          // D. Crear el PaymentIntent
          const payment = await stripe.paymentIntents.create({
            amount: Math.round(precioTotal * 100),
            currency: "eur",
            customer: stripeCustomerId,
            payment_method: paymentMethodId,
            off_session: false,
            confirm: true,
            automatic_payment_methods: {
              enabled: true,
              allow_redirects: "never",
            },
          });

          if (payment.status !== "succeeded") throw new Error("Pago rechazado");
        } catch (stripeError: any) {
          return NextResponse.json(
            { ok: false, error: `Error Pago: ${stripeError.message}` },
            { status: 402 },
          );
        }
      }

      // 4. Crear las Reservas y desgloses
      const reservasCreadas = [];
      const usuarioBD = await UsuarioModel.getById(usuarioId);

      for (const item of vuelosIds) {
        const vueloData = await VueloModel.getById(item.vuelo_id);
        const precioPorVuelo = precioTotal / vuelosIds.length;

        // A. Crear cabecera (Actualiza plazas vía trigger)
        const reserva = await ReservaModel.crear({
          usuario_id: usuarioId,
          vuelo_id: item.vuelo_id,
          codigo_reserva_grupo: codigoGrupo,
          precio_vuelo_historico: Number(vueloData.precio_ajustado),
          total_extras_historico: 0, // Se puede calcular sumando los extras abajo
          precioTotal: precioPorVuelo,
          pasajeros: numPasajeros,
          estado: "confirmada",
        } as ReservaCreateInput);

        // B. Insertar Pasajeros
        await PasajeroModel.crearBulk(
          pasajeros.map((p: any) => ({ ...p, reserva_id: reserva.id })),
        );

        // C. Insertar Extras pagados
        if (extras?.length > 0) {
          for (const ex of extras) {
            if (ex.tipo_vuelo === "ambos" || ex.tipo_vuelo === item.tipo) {
              const servicioData: ReservaServicioInput = {
                reserva_id: reserva.id,
                servicio_id: ex.servicio_id,
                nombre_servicio: ex.nombre_servicio,
                valor_seleccionado: ex.valor_seleccionado || "1",
                cantidad: ex.cantidad || 1,
                precio_unitario_pagado: ex.precio_extra,
                tipo_vuelo: ex.tipo_vuelo,
              };
              await ReservaModel.añadirServicioExtra(servicioData);
            }
          }
        }

        // D. Insertar Servicios Incluidos (Audit)
        const serviciosBase = await ViajeServicioModel.getByViajeId(
          vueloData.viaje_id,
        );
        for (const inc of serviciosBase.filter((s: any) => s.incluido)) {
          const servicioData: ReservaServicioInput = {
            reserva_id: reserva.id,
            servicio_id: inc.servicio_id,
            nombre_servicio: inc.nombre,
            valor_seleccionado: inc.valor,
            cantidad: 1,
            precio_unitario_pagado: 0,
            tipo_vuelo: "ambos",
          };
          await ReservaModel.añadirServicioExtra(servicioData);
        }

        reservasCreadas.push(reserva);

        // ── Email de confirmación por vuelo ────────────────────────────────
        // Fire & forget — no bloquea la respuesta si falla el email
        emailReservaConfirmada({
          to: usuarioBD.email,
          nombre: usuarioBD.nombre || usuarioBD.username,
          localizador: reserva.localizador,
          tipoVuelo: item.tipo as "ida" | "vuelta",
          aeropuertoOrigen: vueloData.aeropuertoOrigen ?? "",
          aeropuertoDestino: vueloData.aeropuertoDestino ?? "",
          fecSalida: vueloData.fecSalida ?? "",
          horaSalida: vueloData.horaSalida ?? "",
          fecLlegada: vueloData.fecLlegada ?? "",
          horaLlegada: vueloData.horaLlegada ?? "",
          // Nombres de pasajeros separados por "||"
          pasajeros: pasajeros
            .map((p: any) => `${p.nombre} ${p.apellidos}`)
            .join("||"),
        }).catch((err) =>
          console.error(
            `❌ Error enviando email reserva ${reserva.localizador}:`,
            err,
          ),
        );
      }

      return NextResponse.json(
        {
          ok: true,
          mensaje: "Reserva confirmada",
          resultado: {
            codigoGrupo,
            total: precioTotal,
            reservas: reservasCreadas.map((r) => ({
              id: r.id,
              localizador: r.localizador,
            })),
          },
        },
        { status: 201 },
      );
    } catch (error: any) {
      console.error("Error Checkout:", error);
      return NextResponse.json(
        { ok: false, error: "Error interno" },
        { status: 500 },
      );
    }
  },

  // GET /api/reservas — admin lista todas
  async listarTodasAdmin(req: Request) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const reservas = await ReservaModel.getAll();
      return NextResponse.json({ ok: true, resultado: reservas });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },

  // GET /api/reservas/usuario/[id]
  async listarPorUsuario(req: Request, id: string) {
    const sesion = await obtenerSesion(req);
    if (!sesion)
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 },
      );

    if (!sesion.isAdmin && String(sesion.id) !== String(id)) {
      return NextResponse.json(
        { ok: false, error: "No puedes ver las reservas de otro usuario" },
        { status: 403 },
      );
    }

    try {
      const reservas = await ReservaModel.getByUsuarioId(id);
      return NextResponse.json({ ok: true, resultado: reservas });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },

  async obtenerDetalle(req: Request, id: string) {
    const sesion = await obtenerSesion(req);
    if (!sesion)
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 },
      );

    try {
      const reserva = await ReservaModel.getById(id);
      if (!reserva)
        return NextResponse.json(
          { ok: false, error: "No encontrada" },
          { status: 404 },
        );

      if (!sesion.isAdmin && String(reserva.usuario_id) !== sesion.id)
        return NextResponse.json(
          { ok: false, error: "Acceso denegado" },
          { status: 403 },
        );

      const pasajeros = await PasajeroModel.getByReservaId(id);
      const todosLosServicios = await ReservaModel.getServiciosByReservaId(id);

      // Separar servicios incluidos (precio 0) de extras pagados
      const serviciosIncluidos = todosLosServicios.filter(
        (s: any) => Number(s.precio || s.precio_unitario_pagado || 0) === 0,
      );
      const extrasPagados = todosLosServicios.filter(
        (s: any) => Number(s.precio || s.precio_unitario_pagado || 0) > 0,
      );

      return NextResponse.json({
        ok: true,
        resultado: {
          ...reserva,
          pasajeros,
          serviciosIncluidos,
          extras: extrasPagados,
          // Mantener todos juntos también por compatibilidad
          servicios: todosLosServicios,
        },
      });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },

  // PATCH /api/reservas/[id]/cancelar — cancelar reserva (propietario o admin)
  async cancelar(req: Request, id: string) {
    const sesion = await obtenerSesion(req);
    if (!sesion)
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 },
      );

    try {
      const reserva = await ReservaModel.getById(id);
      if (!reserva)
        return NextResponse.json(
          { ok: false, error: "Reserva no encontrada" },
          { status: 404 },
        );

      if (!sesion.isAdmin && String(reserva.usuario_id) !== sesion.id) {
        return NextResponse.json(
          { ok: false, error: "No puedes cancelar esta reserva" },
          { status: 403 },
        );
      }

      const reservaActualizada = await ReservaModel.actualizarEstado(
        id,
        "cancelada",
      );
      return NextResponse.json({ ok: true, resultado: reservaActualizada });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },

  // PUT /api/reservas/[id] — actualizar estado (admin)
  async actualizar(req: Request, id: string) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const { estado } = await req.json();
      const reserva = await ReservaModel.actualizarEstado(id, estado);
      return NextResponse.json({ ok: true, resultado: reserva });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },

  // DELETE /api/reservas/[id] — cancelar (admin)
  async eliminar(req: Request, id: string) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      await ReservaModel.eliminar(id);
      return NextResponse.json({ ok: true, mensaje: "Reserva eliminada" });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },
};
