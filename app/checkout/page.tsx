"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import useAuth from "@/hooks/useAuth";
import { FaUser, FaPlus } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { PasoIndicador } from "@/components/reservas/PasoIndicador";
import { PasajeroCard } from "@/components/reservas/PasajeroCard";
import { PasoResumen } from "@/components/reservas/PasoResumen";
import { PasoPago } from "@/components/reservas/PasoPago";
import { BarraTotal } from "@/components/reservas/BarraTotal";
import { VistaExito } from "@/components/reservas/VistaExito";

interface PasajeroForm {
  nombre: string;
  apellidos: string;
  tipoDocumento: "DNI" | "NIE" | "NIF" | "Pasaporte";
  numDocumento: string;
  fecCaducidadDocumento: string;
  fecNacimiento: string;
  esAdulto: boolean;
}

const pasajeroVacio = (): PasajeroForm => ({
  nombre: "",
  apellidos: "",
  tipoDocumento: "DNI",
  numDocumento: "",
  fecCaducidadDocumento: "",
  fecNacimiento: "",
  esAdulto: true,
});

export function formatFecha(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Madrid",
  });
}

export function formatHora(raw: string): string {
  if (!raw) return "—";
  return String(raw).substring(0, 5);
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { usuarioLoggeado } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const idaId = searchParams.get("ida");
  const vueltaId = searchParams.get("vuelta");
  const extrasRaw = searchParams.get("extras");
  const extras: any[] = extrasRaw ? JSON.parse(extrasRaw) : [];

  const [paso, setPaso] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [datosExito, setDatosExito] = useState<any>(null);
  const [vuelosInfo, setVuelosInfo] = useState<any[]>([]);
  const [pasajeros, setPasajeros] = useState<PasajeroForm[]>([pasajeroVacio()]);
  const [metodo, setMetodo] = useState<"tarjeta" | "transferencia" | "paypal">(
    "tarjeta",
  );
  const [guardarTarjeta, setGuardarTarjeta] = useState(false);
  const [tarjetasGuardadas, setTarjetasGuardadas] = useState<any[]>([]);
  const [usarTarjetaGuardada, setUsarTarjetaGuardada] = useState<string | null>(
    null,
  );
  const [tarjetaLast4, setTarjetaLast4] = useState("****");

  useEffect(() => {
    const ids = [idaId, vueltaId].filter(Boolean) as string[];
    Promise.all(
      ids.map((id) => fetch(`/api/vuelos/${id}`).then((r) => r.json())),
    ).then((results) => {
      const vuelos = results.map((r) => r.resultado).filter(Boolean);
      setVuelosInfo(
        vuelos.map((v: any, i: number) => ({
          ...v,
          tipo: i === 0 && idaId ? "ida" : "vuelta",
        })),
      );
    });
  }, [idaId, vueltaId]);

  useEffect(() => {
    if (!usuarioLoggeado?.id) return;
    fetch(`/api/reservas?action=get_cards&userId=${usuarioLoggeado.id}`)
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setTarjetasGuardadas(data))
      .catch(() => {});
  }, [usuarioLoggeado]);

  const nPax = pasajeros.length;
  const precioVuelos = useMemo(
    () => vuelosInfo.reduce((a, v) => a + Number(v.precio_ajustado || 0), 0),
    [vuelosInfo],
  );
  const precioVuelosTotal = precioVuelos * nPax;
  const precioServiciosExtras = useMemo(
    () =>
      extras.reduce(
        (a: number, e: any) => a + Number(e.cantidad) * Number(e.precio_extra),
        0,
      ),
    [extras],
  );
  const precioTotal = precioVuelosTotal + precioServiciosExtras;

  const agregarPasajero = () => setPasajeros((p) => [...p, pasajeroVacio()]);
  const eliminarPasajero = (i: number) =>
    setPasajeros((p) => p.filter((_, idx) => idx !== i));
  const actualizarPasajero = (i: number, k: keyof PasajeroForm, v: any) =>
    setPasajeros((p) => p.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));

  const serviciosIncluidos = useMemo(
    () => vuelosInfo[0]?.serviciosBase || [],
    [vuelosInfo],
  );
  const serviciosAdicionales = useMemo(
    () =>
      extras.map((e: any) => {
        const pu = Number(e.precio_extra || 0);
        const qt = Number(e.cantidad || 1);
        return {
          nombre: e.nombre || e.nombre_servicio,
          cantidad: qt,
          precioUnitario: pu,
          subtotal: qt * pu,
          tipo_vuelo: e.tipo_vuelo,
        };
      }),
    [extras],
  );

  const handleReservar = async () => {
    if (!usuarioLoggeado) return alert("Debes iniciar sesión");
    if (!pasajeros.every((p) => p.nombre && p.apellidos && p.numDocumento))
      return alert("Completa los datos de todos los pasajeros");

    setLoading(true);
    let paymentMethodId = null;
    let last4 = "****";
    let brand = "Tarjeta";

    if (metodo === "tarjeta") {
      if (usarTarjetaGuardada) {
        paymentMethodId = usarTarjetaGuardada;
        const t = tarjetasGuardadas.find(
          (x) => x.stripePaymentMethodId === usarTarjetaGuardada,
        );
        last4 = t?.last4 || "****";
        brand = t?.brand || "Tarjeta";
      } else {
        if (!stripe || !elements) {
          setLoading(false);
          return;
        }
        const cardEl = elements.getElement(CardNumberElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardEl!,
        });
        if (error) {
          alert(error.message);
          setLoading(false);
          return;
        }
        paymentMethodId = paymentMethod.id;
        last4 = paymentMethod.card?.last4 || "****";
        brand = paymentMethod.card?.brand || "Tarjeta";
      }
    }

    setTarjetaLast4(last4);

    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          vuelosIds: [
            idaId && { vuelo_id: Number(idaId), tipo: "ida" },
            vueltaId && { vuelo_id: Number(vueltaId), tipo: "vuelta" },
          ].filter(Boolean),
          pasajeros,
          extras: extras.map((e: any) => ({
            servicio_id: e.servicio_id,
            nombre_servicio: e.nombre,
            valor_seleccionado: e.valor,
            cantidad: e.cantidad,
            precio_extra: e.precio_extra,
            tipo_vuelo: e.tipo_vuelo || "ambos",
          })),
          metodo,
          paymentMethodId,
          precioTotal,
          guardarTarjeta,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        alert(data.error);
        return;
      }

      // Construir datos para VistaExito y PDF
      const reservas = data.resultado.reservas ?? [];
      const localizador =
        reservas[0]?.localizador ??
        reservas.map((r: any) => r.id).join(" / ") ??
        "???";

      setDatosExito({
        localizador,
        id: localizador,
        fechaCompra: new Date().toLocaleDateString("es-ES"),
        nPasajeros: nPax,
        pasajeros: pasajeros.map((p) => ({
          nombreCompleto: `${p.nombre} ${p.apellidos}`,
          documento: `${p.tipoDocumento}: ${p.numDocumento}`,
          tipo: p.esAdulto ? "Adulto" : "Menor",
          fecNacimiento: p.fecNacimiento,
        })),
        vuelos: vuelosInfo.map((v) => ({
          trayectoIda: `${v.aeropuertoOrigen} (${v.iataOrigen || ""}) - ${v.aeropuertoDestino} (${v.iataDestino || ""})`,
          trayectoVuelta: `${v.aeropuertoDestino} (${v.iataDestino || ""}) - ${v.aeropuertoOrigen} (${v.iataOrigen || ""})`,
          tipo: v.tipo,
          precio: Number(v.precio_ajustado || 0),
          precioTotal: Number(v.precio_ajustado || 0) * nPax,
          codigo_vuelo:
            v.iataOrigen && v.iataDestino
              ? `${v.iataOrigen}-${v.iataDestino}`
              : `HA-${v.id}`,
          hora_salida: formatHora(v.horaSalida ?? ""),
          hora_llegada: formatHora(v.horaLlegada ?? ""),
          fecha_salida: formatFecha(v.fecSalida ?? ""),
        })),
        serviciosIncluidos,
        extras: serviciosAdicionales.map((s) => ({
          ...s,
          precioUnitario: `${s.precioUnitario.toFixed(2)}€`,
          subtotal: `${s.subtotal.toFixed(2)}€`,
        })),
        subtotalVuelos: precioVuelosTotal,
        subtotalExtras: precioServiciosExtras,
        pago: {
          metodo:
            metodo === "tarjeta"
              ? "Tarjeta bancaria"
              : metodo === "paypal"
                ? "PayPal"
                : "Transferencia",
          total: data.resultado.total ?? precioTotal,
          last4,
        },
      });

      setPaso(4);
    } catch {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fondo pb-32">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <PasoIndicador paso={paso} />

        <div className="pb-24">
          {/* PASO 1 */}
          {paso === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-titulo-resaltado uppercase tracking-tighter flex items-center gap-2">
                  <FaUser size={14} /> Datos de pasajeros
                </h2>
                <button
                  onClick={agregarPasajero}
                  className="flex items-center gap-1.5 bg-primario/10 text-primario px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primario hover:text-blanco-fijo transition-colors"
                >
                  <FaPlus size={9} /> Añadir
                </button>
              </div>
              <div className="space-y-4">
                {pasajeros.map((p, i) => (
                  <PasajeroCard
                    key={i}
                    i={i}
                    p={p}
                    actualizarPasajero={actualizarPasajero}
                    eliminarPasajero={eliminarPasajero}
                    totalPasajeros={pasajeros.length}
                  />
                ))}
              </div>
              <button
                onClick={() => setPaso(2)}
                className="w-full bg-secundario text-blanco-fijo py-4 rounded-2xl font-black text-sm uppercase hover:bg-primario transition-all flex items-center justify-center gap-2 shadow-lg shadow-secundario/20"
              >
                Revisar itinerario →
              </button>
            </div>
          )}

          {/* PASO 2 */}
          {paso === 2 && (
            <PasoResumen
              vuelosInfo={vuelosInfo}
              pasajeros={pasajeros}
              serviciosIncluidos={serviciosIncluidos}
              serviciosAdicionales={serviciosAdicionales}
              precioVuelosTotal={precioVuelosTotal}
              precioServiciosExtras={precioServiciosExtras}
              precioTotal={precioTotal}
              nPax={nPax}
              formatFecha={formatFecha}
              formatHora={formatHora}
              onVolver={() => setPaso(1)}
              onContinuar={() => setPaso(3)}
            />
          )}

          {/* PASO 3 */}
          {paso === 3 && (
            <PasoPago
              metodo={metodo}
              setMetodo={setMetodo}
              tarjetasGuardadas={tarjetasGuardadas}
              usarTarjetaGuardada={usarTarjetaGuardada}
              setUsarTarjetaGuardada={setUsarTarjetaGuardada}
              guardarTarjeta={guardarTarjeta}
              setGuardarTarjeta={setGuardarTarjeta}
              precioTotal={precioTotal}
              loading={loading}
              onVolver={() => setPaso(2)}
              onPagar={handleReservar}
            />
          )}

          {/* PASO 4 — dentro del flujo para mantener el indicador */}
          {paso === 4 && datosExito && (
            <VistaExito datos={datosExito} router={router} />
          )}
        </div>
      </div>

      <BarraTotal
        paso={paso}
        nPax={nPax}
        precioTotal={precioTotal}
        precioVuelosTotal={precioVuelosTotal}
        precioServiciosExtras={precioServiciosExtras}
      />
    </div>
  );
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center text-gris font-bold animate-pulse">
          Cargando...
        </div>
      }
    >
      <Elements stripe={stripePromise}>
        <CheckoutContent />
      </Elements>
    </Suspense>
  );
}
