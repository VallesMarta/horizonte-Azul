// ==========================================
// 1. ENUMS Y TIPOS PRIMITIVOS
// ==========================================
export type TipoControl = "numero" | "texto" | "booleano";
export type TipoDocumento = "DNI" | "NIE" | "NIF" | "Pasaporte";
export type TipoVuelo = "ida" | "vuelta" | "ambos";
export type EstadoVuelo =
  | "programado"
  | "abordando"
  | "en_vuelo"
  | "completado"
  | "cancelado";
export type EstadoReserva =
  | "pendiente"
  | "confirmada"
  | "realizada"
  | "cancelada";
export type MetodoPago = "tarjeta" | "transferencia" | "paypal";
export type EstadoPago = "exitoso" | "fallido";

// ==========================================
// 2. ENTIDADES PRINCIPALES (Tablas SQL)
// ==========================================
export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  apellidos: string;
  email: string;
  isAdmin: boolean;
  telefono?: string;
  fecNacimiento?: string;
  tipoDocumento: TipoDocumento;
  numDocumento?: string;
  fotoPerfil: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Viaje {
  id: number;
  paisOrigen: string;
  aeropuertoOrigen: string;
  iataOrigen?: string;
  paisDestino: string;
  aeropuertoDestino: string;
  iataDestino?: string;
  img: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

export interface Vuelo {
  id: number;
  viaje_id: number;
  fecSalida: string;
  horaSalida: string;
  fecLlegada: string;
  horaLlegada: string;
  plazasTotales: number;
  plazasDisponibles: number;
  precio_ajustado: number;
  tipo: TipoVuelo;
  estado: EstadoVuelo;
}

export interface Reserva {
  id: number;
  localizador: string;
  usuario_id: number;
  vuelo_id: number;
  codigo_reserva_grupo: string;
  precio_vuelo_historico: number;
  total_extras_historico: number;
  precioTotal: number;
  fecCompra: string;
  pasajeros: number;
  estado: EstadoReserva;
}

export interface Pasajero {
  id: number;
  reserva_id: number;
  nombre: string;
  apellidos: string;
  tipoDocumento: TipoDocumento;
  numDocumento: string;
  fecNacimiento?: string;
  fecCaducidadDocumento?: string;
  esAdulto: boolean;
  tipo: "Adulto" | "Menor"; // Calculado a partir de esAdulto
}

export interface ViajeServicio {
  id: number;
  viaje_id: number;
  servicio_id: number;
  nombre_servicio: string; // Del JOIN con servicios
  valor: string;
  precio_extra: number;
  incluido: boolean;
  cantidad_incluida: number;
}

export interface TarjetaUsuario {
  id: number;
  usuarioId: number;
  stripePaymentMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  nombreTitular?: string;
  esPredeterminada: boolean;
  created_at: string;
}

// ==========================================
// 3. TIPOS COMBINADOS (JOINs — Respuestas de API)
// ==========================================

// GET /api/viajes → Viaje + datos del vuelo más próximo
export type ViajeCompleto = Viaje &
  Pick<
    Vuelo,
    | "fecSalida"
    | "horaSalida"
    | "fecLlegada"
    | "horaLlegada"
    | "plazasDisponibles"
  > & {
    vuelo_id: number;
    precio_final: number;
  };

// GET /api/reservas/usuario/[id] → Reserva + Viaje + Vuelo
export type ReservaDetallada = Reserva &
  Pick<
    Viaje,
    | "paisOrigen"
    | "aeropuertoOrigen"
    | "paisDestino"
    | "aeropuertoDestino"
    | "img"
  > &
  Pick<Vuelo, "fecSalida" | "horaSalida" | "fecLlegada" | "horaLlegada"> & {
    reserva_id: number; // Alias de r.id en la query
    total_pagado: number; // Alias de precioTotal en la query
    vuelo_tipo: TipoVuelo;
    total_extras_calculado?: number;
    iataOrigen?: string;
    iataDestino?: string;
    precio_ajustado: number;
  };

// GET /api/reservas/[id] → Servicio individual dentro del detalle
export interface ReservaServicio {
  id: number;
  servicio_id: number;
  nombre: string;
  detalle: string; // valor_seleccionado
  cantidad: number;
  precio: number; // precio_unitario_pagado
  subtotal: number; // cantidad * precio
  tipo_vuelo: TipoVuelo;
}

export interface AdminStats {
  totales: {
    usuarios: number;
    reservas: number;
    ingresos: number;
    reservas_mes: number;
    vuelos_activos: number;
  };
  top_destinos: {
    paisDestino: string;
    iataDestino: string;
    aeropuertoDestino: string;
    img: string;
    total_reservas: number;
    ingresos: number;
  }[];
  top_wishlist: {
    paisDestino: string;
    iataDestino: string;
    img: string;
    total_guardados: number;
  }[];
  estados: {
    estado: string;
    total: number;
  }[];
  ultimas_reservas: {
    id: number;
    localizador: string;
    fecCompra: string;
    precioTotal: number;
    estado: string;
    pasajeros: number;
    usuario_nombre: string;
    paisDestino: string;
    iataDestino: string;
  }[];
}

// ==========================================
// 4. DTOs DE ENTRADA (Payloads de Request)
// ==========================================

export interface VueloIdItem {
  vuelo_id: number;
  tipo: Exclude<TipoVuelo, "ambos">; // Solo "ida" | "vuelta"
}

export interface PasajeroInput {
  nombre: string;
  apellidos: string;
  tipoDocumento: TipoDocumento;
  numDocumento: string;
  fecNacimiento?: string;
  fecCaducidadDocumento?: string;
}

export interface ExtraInput {
  servicio_id: number;
  nombre_servicio: string;
  valor_seleccionado: string;
  cantidad: number;
  precio_extra: number;
  tipo_vuelo: TipoVuelo;
}

export interface CheckoutPayload {
  vuelosIds: VueloIdItem[];
  pasajeros: PasajeroInput[];
  extras: ExtraInput[];
  metodo: MetodoPago;
  paymentMethodId?: string; // Obligatorio si metodo === "tarjeta"
  precioTotal: number;
  guardarTarjeta: boolean;
}

// ==========================================
// 5. DTOs INTERNOS (Modelos → DB)
// ==========================================

export interface ReservaCreateInput {
  usuario_id: number;
  vuelo_id: number;
  codigo_reserva_grupo: string;
  precio_vuelo_historico: number;
  total_extras_historico: number;
  precioTotal: number;
  pasajeros: number;
  estado?: EstadoReserva;
}

export interface ReservaServicioInput {
  reserva_id: number;
  servicio_id: number;
  nombre_servicio: string;
  valor_seleccionado: string;
  cantidad: number;
  precio_unitario_pagado: number;
  tipo_vuelo: TipoVuelo;
}

// ==========================================
// 6. DTOs DE ACTUALIZACIÓN Y UTILIDAD
// ==========================================

// Registro: el ID y las fechas de auditoría los genera SQL
export type RegistroUsuarioDTO = Omit<
  Usuario,
  "id" | "created_at" | "updated_at" | "isAdmin"
> & {
  password: string;
};

// Solo se permite cambiar el estado de una reserva
export type ActualizarReservaDTO = Pick<Reserva, "estado">;

export type WishlistDTO = {
  usuario_id: number;
  viaje_id: number;
};
