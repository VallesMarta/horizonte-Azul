-- ============================
-- CONFIGURACIÓN INICIAL
-- ============================
SET client_encoding = 'UTF8';
SET timezone = 'Europe/Madrid';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================
-- FUNCIÓN GENÉRICA PARA UPDATED_AT
-- ============================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================
-- TIPOS ENUM
-- ============================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_control_enum') THEN
        CREATE TYPE tipo_control_enum AS ENUM ('numero', 'texto', 'booleano');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_documento_enum') THEN
        CREATE TYPE tipo_documento_enum AS ENUM ('DNI', 'NIE', 'NIF', 'Pasaporte');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_reserva_enum') THEN
        CREATE TYPE estado_reserva_enum AS ENUM ('pendiente', 'confirmada', 'realizada', 'cancelada');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'metodo_enum') THEN
        CREATE TYPE metodo_enum AS ENUM ('tarjeta', 'transferencia', 'paypal');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_pago_enum') THEN
        CREATE TYPE estado_pago_enum AS ENUM ('exitoso', 'fallido');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_vuelo_enum') THEN
        CREATE TYPE estado_vuelo_enum AS ENUM (
            'programado',
            'abordando',
            'en_vuelo',
            'completado',
            'cancelado'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_vuelo_enum') THEN
        CREATE TYPE tipo_vuelo_enum AS ENUM ('ida', 'vuelta', 'ambos');
    END IF;
END $$;

-- ============================
-- TABLA: USUARIOS
-- ============================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) DEFAULT '',
    email VARCHAR(100) NOT NULL UNIQUE,
    "isAdmin" BOOLEAN DEFAULT FALSE,
    telefono VARCHAR(20),
    "fecNacimiento" DATE,
    "tipoDocumento" tipo_documento_enum DEFAULT 'DNI',
    "numDocumento" VARCHAR(25) UNIQUE,
    "paisEmision" VARCHAR(100),
    "fecCaducidadDocumento" DATE,
    "fotoPerfil" TEXT DEFAULT 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS tr_usuarios_updated_at ON usuarios;
CREATE TRIGGER tr_usuarios_updated_at 
BEFORE UPDATE ON usuarios 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================
-- TABLA: VIAJES
-- ============================
CREATE TABLE IF NOT EXISTS viajes (
    id SERIAL PRIMARY KEY,
    "paisOrigen" VARCHAR(100) NOT NULL,            
    "aeropuertoOrigen" VARCHAR(100) NOT NULL,
    "iataOrigen" VARCHAR(3),
    "paisDestino" VARCHAR(100) NOT NULL,           
    "aeropuertoDestino" VARCHAR(100) NOT NULL,
    "iataDestino" VARCHAR(3),
    img TEXT,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS tr_viajes_updated_at ON viajes;
CREATE TRIGGER tr_viajes_updated_at 
BEFORE UPDATE ON viajes 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================
-- TABLA: VUELOS
-- ============================
CREATE TABLE IF NOT EXISTS vuelos (
    id SERIAL PRIMARY KEY,
    viaje_id INT NOT NULL REFERENCES viajes(id) ON DELETE CASCADE,
    "fecSalida" DATE NOT NULL,
    "horaSalida" TIME NOT NULL,
    "fecLlegada" DATE NOT NULL,
    "horaLlegada" TIME NOT NULL,
    "plazasTotales" INT DEFAULT 150,
    "plazasDisponibles" INT DEFAULT 150,
    precio_ajustado DECIMAL(10,2),
    tipo VARCHAR(10) DEFAULT 'ida',
    estado estado_vuelo_enum DEFAULT 'programado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS tr_vuelos_updated_at ON vuelos;
CREATE TRIGGER tr_vuelos_updated_at 
BEFORE UPDATE ON vuelos 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION actualizar_plazas_disponibles()
RETURNS TRIGGER AS $$
DECLARE
    vuelo_id_afectado INT;
BEGIN
    -- Detectar vuelo afectado según operación
    vuelo_id_afectado := COALESCE(NEW.vuelo_id, OLD.vuelo_id);

    UPDATE vuelos
    SET "plazasDisponibles" = "plazasTotales" - (
        SELECT COALESCE(SUM(pasajeros), 0)
        FROM reservas
        WHERE vuelo_id = vuelo_id_afectado
        AND estado != 'cancelada'
    )
    WHERE id = vuelo_id_afectado;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: AUTO-COMPLETAR VUELOS PASADOS

CREATE OR REPLACE FUNCTION calcular_estado_vuelo_tiempo_real()
RETURNS TRIGGER AS $$
DECLARE
    momento_actual TIMESTAMP;
    momento_salida TIMESTAMP;
    momento_llegada TIMESTAMP;
BEGIN
    -- Obtenemos el tiempo real del sistema
    momento_actual := NOW();    
    -- Unimos DATE y TIME en un formato TIMESTAMP para cálculos matemáticos precisos
    momento_salida  := (NEW."fecSalida" + NEW."horaSalida"::time);
    momento_llegada := (NEW."fecLlegada" + NEW."horaLlegada"::time);
    -- Si el administrador canceló el vuelo a mano, no dejamos que el tiempo lo altere
    IF OLD IS NOT NULL AND OLD.estado = 'cancelado' THEN
        RETURN NEW;
    END IF;
    -- LÓGICA DE TIEMPO REAL
    IF momento_actual >= momento_llegada THEN
        -- Ya ha pasado la hora de llegada
        NEW.estado := 'completado';        
    ELSIF momento_actual >= momento_salida AND momento_actual < momento_llegada THEN
        -- Está entre la hora de salida y llegada
        NEW.estado := 'en_vuelo';        
    ELSIF momento_actual >= (momento_salida - INTERVAL '45 minutes') AND momento_actual < momento_salida THEN
        -- Faltan 45 minutos o menos para despegar
        NEW.estado := 'abordando';        
    ELSE        -- Falta más de 45 minutos para el despegue
        NEW.estado := 'programado';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_vuelos_estado_y_tiempo
BEFORE INSERT OR UPDATE ON vuelos
FOR EACH ROW
EXECUTE FUNCTION calcular_estado_vuelo_tiempo_real();

CREATE OR REPLACE FUNCTION actualizar_estado_reservas_por_vuelo()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Si el vuelo pasa a 'completado' (el avión aterrizó)
    IF NEW.estado = 'completado' THEN
        UPDATE reservas
        SET estado = 'realizada',
            updated_at = CURRENT_TIMESTAMP
        WHERE vuelo_id = NEW.id 
          AND estado NOT IN ('cancelada', 'realizada');
    
    -- 2. Si el vuelo se cancela
    ELSIF NEW.estado = 'cancelado' THEN
        UPDATE reservas
        SET estado = 'cancelada',
            updated_at = CURRENT_TIMESTAMP
        WHERE vuelo_id = NEW.id 
          AND estado != 'cancelada';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Asociamos el disparador a la tabla de vuelos (cuando se altera la columna estado)
DROP TRIGGER IF EXISTS tr_vuelos_hacia_reservas ON vuelos;
CREATE TRIGGER tr_vuelos_hacia_reservas
AFTER UPDATE OF estado ON vuelos
FOR EACH ROW
EXECUTE FUNCTION actualizar_estado_reservas_por_vuelo();

-- ============================
-- TABLA: SERVICIOS
-- ============================
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE, 
    tipo_control tipo_control_enum NOT NULL DEFAULT 'texto',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS tr_servicios_updated_at ON servicios;
CREATE TRIGGER tr_servicios_updated_at 
BEFORE UPDATE ON servicios 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================
-- RELACIÓN: VIAJE_SERVICIO
-- ============================
CREATE TABLE IF NOT EXISTS viaje_servicio (
    id SERIAL PRIMARY KEY,
    viaje_id INT NOT NULL REFERENCES viajes(id) ON DELETE CASCADE,
    servicio_id INT NOT NULL REFERENCES servicios(id) ON DELETE CASCADE,
    valor VARCHAR(255),    
    precio_extra DECIMAL(10, 2) DEFAULT 0.00,
    incluido BOOLEAN DEFAULT FALSE,
    cantidad_incluida INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS tr_viaje_servicio_updated_at ON viaje_servicio;
CREATE TRIGGER tr_viaje_servicio_updated_at 
BEFORE UPDATE ON viaje_servicio 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================
-- TABLA: RESERVAS
-- ============================
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    localizador VARCHAR(12),
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    vuelo_id INT NOT NULL REFERENCES vuelos(id) ON DELETE CASCADE,
    codigo_reserva_grupo UUID DEFAULT uuid_generate_v4(), -- Agrupador para cuando se compra Ida+Vuelta en una misma sesión. Así el usuario ve una "compra" aunque sean dos registros de vuelo
    precio_vuelo_historico DECIMAL(10,2) NOT NULL,
    total_extras_historico DECIMAL(10,2) DEFAULT 0.00,
    "precioTotal" DECIMAL(10,2),
    "fecCompra" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pasajeros INT DEFAULT 1 CHECK (pasajeros >= 1),
    estado estado_reserva_enum DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS tr_reservas_updated_at ON reservas;
CREATE TRIGGER tr_reservas_updated_at 
BEFORE UPDATE ON reservas 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_reservas_insert ON reservas;
CREATE TRIGGER tr_reservas_insert
AFTER INSERT ON reservas
FOR EACH ROW
EXECUTE FUNCTION actualizar_plazas_disponibles();

DROP TRIGGER IF EXISTS tr_reservas_update ON reservas;
CREATE TRIGGER tr_reservas_update
AFTER UPDATE ON reservas
FOR EACH ROW
EXECUTE FUNCTION actualizar_plazas_disponibles();

DROP TRIGGER IF EXISTS tr_reservas_delete ON reservas;
CREATE TRIGGER tr_reservas_delete
AFTER DELETE ON reservas
FOR EACH ROW
EXECUTE FUNCTION actualizar_plazas_disponibles();

-- Trigger para auto-generar localizador en nuevas reservas
CREATE OR REPLACE FUNCTION generar_localizador()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.localizador IS NULL THEN
    NEW.localizador := 'HA-' || UPPER(SUBSTRING(REPLACE(NEW.codigo_reserva_grupo::text, '-', ''), 1, 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_generar_localizador ON reservas;
CREATE TRIGGER tr_generar_localizador
BEFORE INSERT ON reservas
FOR EACH ROW
EXECUTE FUNCTION generar_localizador();


-- ============================
-- TABLA: RESERVA_SERVICIOS (Desglose de extras)
-- ============================
CREATE TABLE IF NOT EXISTS reserva_servicios (
    id SERIAL PRIMARY KEY,
    reserva_id INT NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    servicio_id INT NOT NULL REFERENCES servicios(id),
    nombre_servicio VARCHAR(100), -- Copiamos el nombre por si el servicio cambia o se borra
    valor_seleccionado VARCHAR(255),
    cantidad INT DEFAULT 1,
    precio_unitario_pagado DECIMAL(10,2) NOT NULL, -- El precio en el momento de la compra
    total_linea DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario_pagado) STORED,
    tipo_vuelo tipo_vuelo_enum NOT NULL DEFAULT 'ambos',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- TABLA: WISHLIST
-- ============================
CREATE TABLE IF NOT EXISTS wishlist (
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    viaje_id INT REFERENCES viajes(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, viaje_id)
);

-- ============================
-- TABLA: TAREJTAS DE LOS USUARIOS
-- ============================

CREATE TABLE IF NOT EXISTS tarjetas_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre_titular VARCHAR(255),
    stripe_payment_method_id VARCHAR(255) NOT NULL UNIQUE,
    last4 VARCHAR(4) NOT NULL,
    brand VARCHAR(50),
    es_predeterminada BOOLEAN DEFAULT false,
    exp_month INT,
    exp_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para updated_at (siguiendo tu estándar)
DROP TRIGGER IF EXISTS tr_tarjetas_usuario_updated_at ON tarjetas_usuario;
CREATE TRIGGER tr_tarjetas_usuario_updated_at 
BEFORE UPDATE ON tarjetas_usuario 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================
-- TABLA: PASAJEROS
-- ============================
CREATE TABLE IF NOT EXISTS pasajeros (
    id SERIAL PRIMARY KEY,
    reserva_id INT NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    "tipoDocumento" tipo_documento_enum DEFAULT 'DNI',
    "numDocumento" VARCHAR(25),
    "fecCaducidadDocumento" DATE,
    "fecNacimiento" DATE,
    "esAdulto" BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS tr_pasajeros_updated_at ON pasajeros;
CREATE TRIGGER tr_pasajeros_updated_at 
BEFORE UPDATE ON pasajeros 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================
-- TOKENS Y LIMPIEZA
-- ============================
CREATE TABLE IF NOT EXISTS tokens_activos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    "expiraEn" TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION limpiar_tokens_caducados()
RETURNS trigger AS $$
BEGIN
    DELETE FROM tokens_activos WHERE "expiraEn" < NOW();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_limpieza_tokens ON tokens_activos;
CREATE TRIGGER trigger_limpieza_tokens
AFTER INSERT ON tokens_activos
FOR EACH STATEMENT
EXECUTE FUNCTION limpiar_tokens_caducados();

-- ============================
-- TABLA: MENSAJES_CONTACTO
-- ============================
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    leido BOOLEAN DEFAULT FALSE,
    respondido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS tr_mensajes_contacto_updated_at ON mensajes_contacto;
CREATE TRIGGER tr_mensajes_contacto_updated_at
BEFORE UPDATE ON mensajes_contacto
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS contacto_mensajes (
    id SERIAL PRIMARY KEY,
    contacto_id INT NOT NULL REFERENCES mensajes_contacto(id) ON DELETE CASCADE,
    autor VARCHAR(10) NOT NULL CHECK (autor IN ('usuario', 'admin')),
    contenido TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- TABLA: NOTIFICACIONES
-- ============================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_notificacion_enum') THEN
        CREATE TYPE tipo_notificacion_enum AS ENUM (
            'respuesta_contacto',
            'reserva_confirmada',
            'reserva_cancelada',
            'reserva_pendiente',
            'sistema'
        );
    END IF;
END $$;


CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo tipo_notificacion_enum NOT NULL DEFAULT 'sistema',
    titulo VARCHAR(200) NOT NULL,
    cuerpo TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    enlace VARCHAR(300),
    mensaje_contacto_id INT REFERENCES mensajes_contacto(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);