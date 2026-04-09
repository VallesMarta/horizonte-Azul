// ==========================================
// 1. ENUMS (Tipos de Unión)
// ==========================================
export type TipoControl = 'numero' | 'texto' | 'booleano';
export type TipoDocumento = "DNI" | "NIE" | "NIF" | "Pasaporte";
export type EstadoReserva = 'pendiente' | 'confirmada' | 'realizada' | 'cancelada';
export type MetodoPago = 'tarjeta' | 'transferencia' | 'paypal';
export type EstadoPago = 'exitoso' | 'fallido';
export type TipoVuelo = 'ida' | 'vuelta';
export type EstadoVuelo = 'programado' | 'abordando' | 'volando' | 'cancelado';

// ==========================================
// 2. ENTIDADES PRINCIPALES (Tablas SQL)
// ==========================================

export interface Usuario {
  id?: number;
  username: string;
  password?: string;
  nombre: string;
  apellidos: string;
  email: string;
  isAdmin: boolean;
  telefono?: string;
  fecNacimiento?: string;
  tipoDocumento: TipoDocumento;
  numDocumento?: string;
  paisEmision?: string;
  fecCaducidadDocumento?: string;
  fotoPerfil: string;
  created_at?: string;
  updated_at?: string;
}

export interface Viaje {
  id?: number;
  paisOrigen: string;
  aeropuertoOrigen: string;
  iataOrigen?: string;
  paisDestino: string;
  aeropuertoDestino: string;
  iataDestino?: string;
  precio_base: number;
  img: string;
  descripcion: string;
  created_at?: string;
  updated_at?: string;
}

export interface Vuelo {
  id?: number;
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
  created_at?: string;
  updated_at?: string;
}

export interface Reserva {
  id?: number;
  usuario_id: number;
  vuelo_id: number;
  fecCompra?: string;
  pasajeros: number;
  precioTotal: number;
  estado: EstadoReserva;
}

export interface Pasajero {
  id?: number;
  reserva_id: number;
  nombre: string;
  apellidos: string;
  tipoDocumento: TipoDocumento;
  numDocumento: string;
  esAdulto: boolean;
  created_at?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  tipo_control: TipoControl;
}

export interface ViajeServicio {
  id?: number;
  viaje_id: number;
  servicio_id: number;
  valor: string;
  precio_extra: number;
  nombre_servicio?: string;
}

export interface MetodoPagoInfo {
  id?: number;
  usuario_id: number;
  last4: string;
  marca: string;
  token_simulado: string;
  fecha_guardado?: string;
}

export interface Pago {
  id?: number;
  reserva_id: number;
  usuario_id: number;
  metodo_pago_id?: number | null;
  monto: number;
  metodo: MetodoPago;
  tipo_tarjeta?: string;
  estado: EstadoPago;
  fecha_pago?: string;
}

export interface Wishlist {
  usuario_id: number;
  viaje_id: number;
}

export interface TokenActivo {
  id?: number;
  usuario_id: number;
  token: string;
  expiraEn: string;
  created_at?: string;
}

// ==========================================
// 3. TIPOS COMBINADOS (Para UI y Respuestas Complejas)
// ==========================================

export interface ViajeCompleto extends Viaje {
  vuelo_id: number;
  fecSalida: string;
  horaSalida: string;
  fecLlegada: string;
  horaLlegada: string;
  plazasDisponibles: number;
  precio_final: number; // precio_ajustado o precio_base
}