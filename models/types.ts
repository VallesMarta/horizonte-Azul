export interface Usuario {
  id?: number;
  username: string;
  nombre: string;
  email: string;
  isAdmin: boolean;
  created_at?: Date;
}

export interface Viaje {
  id?: number;
  paisOrigen: string;
  aeropuertoOrigen: string; 
  horaSalida: string;       
  paisDestino: string;
  aeropuertoDestino: string;
  horaLlegada: string;
  precio: number;
  img: string;
  descripcion: string;
  created_at?: string;
}

export interface Servicio {
  id: number;          
  nombre: string;
  tipo_control: 'numero' | 'texto' | 'booleano';
}

export interface ViajeServicio {
  servicio_id: number;
  nombre?: string;
  valor: string;
  precio_extra: number;
  tipo_control?: 'numero' | 'texto' | 'booleano';
}

export interface Reserva {
  id?: number;
  usuario_id: number;
  viaje_id: number;
  fecSalida: string;
  pasajeros: number;
  estado: 'pendiente' | 'confirmada' | 'realizada' | 'cancelada';
  fecCompra?: string;
}
export interface ReservaDetallada {
  reserva_id: number;
  paisOrigen: string;      
  paisDestino: string;
  aeropuertoOrigen: string;
  aeropuertoDestino: string;
  img: string;
  estado: string;
  total_pagado: number;
  fecSalida: string;
  pasajeros: number;
  tipo_tarjeta: string;
}

export interface DetalleViajeCompleto {
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
  fechaLlegada: string;
  horaLlegada: string;
  duracion: string;
  servicios: ViajeServicio[];
}

export interface Wishlist {
  usuario_id: number;
  viaje_id: number;
}