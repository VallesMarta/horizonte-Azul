-- ============================
-- CONFIGURACIÓN INICIAL
-- ============================
SET client_encoding = 'UTF8';
SET timezone = 'Europe/Madrid';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================
-- FUNCIÓN GENÉRICA PARA UPDATED_AT
-- ============================
-- Esta función la usaremos en todas las tablas para no repetir código
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
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_control_enum') THEN
        CREATE TYPE tipo_control_enum AS ENUM ('numero', 'texto', 'booleano');
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
    "tipoDocumento" VARCHAR(20) DEFAULT 'DNI',
    "numDocumento" VARCHAR(25) UNIQUE,
    "paisEmision" VARCHAR(100),
    "fecCaducidadDocumento" DATE,
    "fotoPerfil" TEXT DEFAULT 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
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
    precio_base DECIMAL(10,2) NOT NULL DEFAULT 0.00, 
    img TEXT,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    estado VARCHAR(20) DEFAULT 'programado', -- programado, abordando, volando, cancelado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER tr_vuelos_updated_at 
BEFORE UPDATE ON vuelos 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================
-- TABLA: SERVICIOS
-- ============================
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE, 
    tipo_control tipo_control_enum NOT NULL DEFAULT 'texto'
);

-- ============================
-- RELACIÓN: VIAJE_SERVICIO
-- ============================
CREATE TABLE IF NOT EXISTS viaje_servicio (
    id SERIAL PRIMARY KEY,
    viaje_id INT NOT NULL REFERENCES viajes(id) ON DELETE CASCADE,
    servicio_id INT NOT NULL REFERENCES servicios(id) ON DELETE CASCADE,
    valor VARCHAR(255),
    precio_extra DECIMAL(10, 2) DEFAULT 0.00,
    CONSTRAINT unique_viaje_servicio UNIQUE (viaje_id, servicio_id)
);

-- ============================
-- TABLA: RESERVAS (Apunta a VUELO)
-- ============================
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    vuelo_id INT NOT NULL REFERENCES vuelos(id) ON DELETE CASCADE, -- Cambiado de viaje_id a vuelo_id
    "fecCompra" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pasajeros INT DEFAULT 1 CHECK (pasajeros >= 1),
    "precioTotal" DECIMAL(10,2),
    estado estado_reserva_enum DEFAULT 'pendiente'
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
-- TABLA: METODOS_PAGO
-- ============================
CREATE TABLE IF NOT EXISTS metodos_pago (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    last4 VARCHAR(4) NOT NULL,
    marca VARCHAR(20), 
    token_simulado VARCHAR(255), 
    fecha_guardado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- TABLA: PAGOS
-- ============================
CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    reserva_id INT NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    metodo_pago_id INT NULL REFERENCES metodos_pago(id) ON DELETE SET NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo metodo_enum DEFAULT 'tarjeta',
    tipo_tarjeta VARCHAR(20) NULL,
    estado estado_pago_enum DEFAULT 'exitoso',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pasajeros (
    id SERIAL PRIMARY KEY,
    reserva_id INT NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    "tipoDocumento" VARCHAR(20) DEFAULT 'DNI',
    "numDocumento" VARCHAR(25),
    "esAdulto" BOOLEAN DEFAULT TRUE, -- Para diferenciar tarifas o permisos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TRIGGER trigger_limpieza_tokens
AFTER INSERT ON tokens_activos
EXECUTE FUNCTION limpiar_tokens_caducados();

-- ============================
-- INSERTS DATOS
-- ============================

-- USUARIOS
INSERT INTO usuarios (username, password, nombre, email, "isAdmin")
VALUES ('admin', '$2b$10$IPPgQWKDY55Mvo62LvQ9Y.cJltDuU7G5roTFEh/Zt37XAUclC1F5O', 'Administrador', 'admin@horizonteazul.com', true)
ON CONFLICT (username) DO NOTHING;

-- SERVICIOS
INSERT INTO servicios (id, nombre, tipo_control) VALUES 
    (1, 'Maleta extra 23kg', 'numero'), (2, 'Equipaje deportivo', 'numero'), 
    (3, 'Instrumentos musicales', 'numero'), (4, 'Equipaje frágil', 'numero'), 
    (5, 'Asiento XL', 'texto'), (6, 'Acceso Sala VIP', 'booleano'),
    (7, 'Pack descanso (Manta/Antifaz)', 'booleano'), (8, 'Menú a bordo', 'texto'), 
    (9, 'Cambio de fecha flexible', 'booleano'), (10, 'Cancelación garantizada', 'booleano'), 
    (11, 'Check-in prioritario', 'booleano'), (12, 'Fast Track (Control rápido)', 'booleano'),
    (13, 'Bus al destino (Enlace)', 'booleano'), (14, 'Transfer privado', 'booleano'), 
    (15, 'Alquiler de coche (Días)', 'numero'), (16, 'Parking en aeropuerto (Días)', 'numero'), 
    (17, 'Mascota en cabina', 'numero'), (18, 'Mascota en bodega', 'numero'),    
    (19, 'Wi-Fi alta velocidad', 'booleano'), (20, 'Puerto USB/Enchufe', 'booleano')
ON CONFLICT (id) DO NOTHING;

-- VIAJES
INSERT INTO viajes (id, "paisOrigen", "aeropuertoOrigen", "iataOrigen", "paisDestino", "aeropuertoDestino", "iataDestino", precio_base, img, descripcion) VALUES
(1, 'España','Valencia','VLC','Irlanda','Galway','GWY',160.89,'https://images.ireland.com/thumbs/Images/galway/6fc964e86ea345409536504e19add100/standardlarge-desktop.jpg','Conecta con Galway y disfruta de sus calles coloridas.'),
(2, 'España','Madrid','MAD','Italia','Roma','FCO',120.00,'https://www.bekiaviajes.com/images/ciudades/portada/0000/6-h.jpg','Vuela directo a Roma y descubre el Coliseo.'),
(3, 'España','Barcelona','BCN','Francia','París','CDG',95.56,'https://www.turium.es/wp-content/uploads/sites/4/2025/06/que-ver-paris-torre-eiffel-796x530.jpg','Conecta con París y disfruta de la Torre Eiffel.'),
(4, 'España','Valencia','VLC','Alemania','Berlín','BER',130.00,'https://thishotel.es/wp-content/uploads/2021/01/berlin.jpg','Explora Berlín con su vibrante arte urbano.'),
(5, 'España','Sevilla','SVQ','Portugal','Lisboa','LIS',89.87,'https://aunclicdelaaventura.com/wp-content/uploads/2021/11/Que-ver-en-Lisboa.jpg','Descubre Lisboa y sus miradores.'),
(6, 'Estados Unidos','Nueva York','JFK','Canadá','Toronto','YYZ',220.00,'https://pohcdn.com/sites/default/files/styles/node__blog_post__bp_banner/public/2021-05/Nathan%20-Phillips-Square.jpg','Cruza el continente y descubre Toronto.'),
(7, 'Alemania','Berlín','BER','México','Ciudad de México','MEX',600.99,'https://images.musement.com/cover/0002/99/mexico-city-xl-jpg_header-198157.jpeg','Descubre la riqueza cultural de CDMX.'),
(8, 'España', 'Madrid', 'MAD', 'Egipto', 'Cairo', 'CAI', 1450.00, 'https://images.unsplash.com/photo-1539768942893-daf53e448371', 'Viaje inolvidable al antiguo Egipto y crucero por el Nilo.'),
(9, 'España', 'Madrid', 'MAD', 'Japón', 'Tokio', 'NRT', 1100.00, 'https://estaticos-cdn.prensaiberica.es/clip/ec9e7d0a-b746-4ffb-b91e-140a4f1ed122_original-libre-aspect-ratio_default_0.jpg', 'Explora la tierra del sol naciente de Shinjuku a Kioto.')
ON CONFLICT (id) DO NOTHING;

-- VUELOS (Múltiples fechas para cada viaje)
-- VUELOS (Idas y Vueltas programadas)
INSERT INTO vuelos (viaje_id, "fecSalida", "horaSalida", "fecLlegada", "horaLlegada", "plazasDisponibles", precio_ajustado, tipo) VALUES
-- VIAJE 1: GALWAY
(1, '2026-05-10', '08:00:00', '2026-05-10', '10:45:00', 150, 160.89, 'ida'),
(1, '2026-05-12', '08:00:00', '2026-05-12', '10:45:00', 150, 160.89, 'ida'),
(1, '2026-05-15', '14:00:00', '2026-05-15', '16:45:00', 150, 140.00, 'vuelta'),
(1, '2026-05-17', '14:00:00', '2026-05-17', '16:45:00', 150, 140.00, 'vuelta'),

-- VIAJE 2: ROMA
(2, '2026-05-12', '10:00:00', '2026-05-12', '12:30:00', 180, 120.00, 'ida'),
(2, '2026-05-14', '10:00:00', '2026-05-14', '12:30:00', 180, 120.00, 'ida'),
(2, '2026-05-18', '20:00:00', '2026-05-18', '22:30:00', 180, 115.00, 'vuelta'),
(2, '2026-05-20', '20:00:00', '2026-05-20', '22:30:00', 180, 115.00, 'vuelta')
ON CONFLICT DO NOTHING;

-- 13.4 RELACIÓN VIAJE-SERVICIO
INSERT INTO viaje_servicio (viaje_id, servicio_id, valor, precio_extra) VALUES
-- Servicios para todos los viajes (Maletas y Wi-Fi)
(1, 1, '1', 40.00), (1, 19, 'true', 10.00), (1, 11, 'true', 15.00),
(2, 1, '1', 35.00), (2, 8, 'Menú Gourmet', 20.00), (2, 5, 'Ventanilla', 12.00),
(3, 1, '1', 30.00), (3, 6, 'true', 25.00), (3, 14, 'true', 45.00),
(4, 1, '1', 35.00), (4, 2, 'Bicicleta', 50.00), (4, 16, '3', 30.00),
(5, 1, '1', 25.00), (5, 9, 'true', 15.00), (5, 20, 'true', 0.00),
(6, 1, '2', 80.00), (6, 5, 'Asiento XL', 60.00), (6, 12, 'true', 20.00),
(7, 1, '2', 90.00), (7, 18, '1', 120.00), (7, 7, 'true', 15.00),
(8, 1, '2', 0.00),  (8, 6, 'true', 0.00),  (8, 8, 'Pensión Completa', 0.00), -- Egipto suele ser pack cerrado
(9, 1, '2', 100.00), (9, 5, 'Cama Business', 250.00), (9, 17, '1', 150.00), (9, 19, 'true', 0.00)
ON CONFLICT (viaje_id, servicio_id) DO NOTHING;