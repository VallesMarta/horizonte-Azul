-- =============================================
-- SCRIPT DE LIMPIEZA TOTAL (UNDO)
-- =============================================

-- 1. Eliminar Triggers (opcional, ya que caen al borrar la tabla, pero por limpieza)
DROP TRIGGER IF EXISTS trigger_limpieza_tokens ON tokens_activos;

-- 2. Eliminar Tablas (en orden inverso de jerarquía para evitar errores de Foreign Key)
DROP TABLE IF EXISTS tokens_activos CASCADE;
DROP TABLE IF EXISTS pasajeros CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS metodos_pago CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS viaje_servicio CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;
DROP TABLE IF EXISTS vuelos CASCADE;
DROP TABLE IF EXISTS viajes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- 3. Eliminar Funciones
DROP FUNCTION IF EXISTS limpiar_tokens_caducados();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 4. Eliminar Tipos ENUM
DROP TYPE IF EXISTS estado_pago_enum;
DROP TYPE IF EXISTS metodo_enum;
DROP TYPE IF EXISTS estado_reserva_enum;
DROP TYPE IF EXISTS tipo_control_enum;

-- 5. Eliminar Extensiones (opcional, solo si quieres limpiar el DB al 100%)
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- MENSAJE DE CONFIRMACIÓN
-- 'Base de datos limpia. Lista para volver a ejecutar init.sql'