-- =============================================
-- SCRIPT DE LIMPIEZA (UNDO)
-- =============================================

-- 1. Eliminar Triggers
DROP TRIGGER IF EXISTS trigger_limpieza_tokens ON tokens_activos;
DROP TRIGGER IF EXISTS tr_reservas_insert ON reservas;
DROP TRIGGER IF EXISTS tr_reservas_update ON reservas;
DROP TRIGGER IF EXISTS tr_reservas_delete ON reservas;
DROP TRIGGER IF EXISTS tr_generar_localizador ON reservas;
DROP TRIGGER IF EXISTS tr_usuarios_updated_at ON usuarios;
DROP TRIGGER IF EXISTS tr_viajes_updated_at ON viajes;
DROP TRIGGER IF EXISTS tr_vuelos_updated_at ON vuelos;
DROP TRIGGER IF EXISTS tr_servicios_updated_at ON servicios;
DROP TRIGGER IF EXISTS tr_viaje_servicio_updated_at ON viaje_servicio;
DROP TRIGGER IF EXISTS tr_reservas_updated_at ON reservas;
DROP TRIGGER IF EXISTS tr_tarjetas_usuario_updated_at ON tarjetas_usuario;
DROP TRIGGER IF EXISTS tr_pasajeros_updated_at ON pasajeros;

-- 2. Eliminar Tablas (Orden de jerarquía para FK)
DROP TABLE IF EXISTS tokens_activos CASCADE;
DROP TABLE IF EXISTS pasajeros CASCADE;
DROP TABLE IF EXISTS tarjetas_usuario CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS reserva_servicios CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS viaje_servicio CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;
DROP TABLE IF EXISTS vuelos CASCADE;
DROP TABLE IF EXISTS viajes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- 3. Eliminar Funciones
DROP FUNCTION IF EXISTS limpiar_tokens_caducados();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS actualizar_plazas_disponibles();
DROP FUNCTION IF EXISTS marcar_vuelos_completados();
DROP FUNCTION IF EXISTS generar_localizador();

-- 4. Eliminar Tipos ENUM
DROP TYPE IF EXISTS estado_pago_enum CASCADE;
DROP TYPE IF EXISTS metodo_enum CASCADE;
DROP TYPE IF EXISTS estado_reserva_enum CASCADE;
DROP TYPE IF EXISTS tipo_control_enum CASCADE;
DROP TYPE IF EXISTS estado_vuelo_enum CASCADE;
DROP TYPE IF EXISTS tipo_vuelo_enum CASCADE;
DROP TYPE IF EXISTS tipo_documento_enum CASCADE; -- <--- AGREGADA

-- 5. Extensiones
-- DROP EXTENSION IF EXISTS "uuid-ossp";

DO $$ 
BEGIN 
    RAISE NOTICE 'Base de datos limpia al 100 por ciento. Lista para el nuevo esquema con Stripe.'; 
END $$;