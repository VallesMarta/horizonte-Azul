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
    estado VARCHAR(20) DEFAULT 'programado',
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

CREATE OR REPLACE FUNCTION marcar_vuelos_completados()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vuelos
  SET estado = 'completado'
  WHERE "fecSalida" < CURRENT_DATE
    AND estado NOT IN ('completado', 'cancelado');
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Se dispara cada vez que se consulta/inserta un vuelo
DROP TRIGGER IF EXISTS tr_auto_completar_vuelos ON vuelos;
CREATE TRIGGER tr_auto_completar_vuelos
AFTER INSERT ON vuelos
FOR EACH STATEMENT
EXECUTE FUNCTION marcar_vuelos_completados();

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
    incluido BOOLEAN DEFAULT FALSE,
    cantidad_incluida INT DEFAULT 0
);

-- ============================
-- TABLA: RESERVAS
-- ============================
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    vuelo_id INT NOT NULL REFERENCES vuelos(id) ON DELETE CASCADE,
    "fecCompra" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pasajeros INT DEFAULT 1 CHECK (pasajeros >= 1),
    "precioTotal" DECIMAL(10,2),
    estado estado_reserva_enum DEFAULT 'pendiente'
);

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
-- INSERTS DATOS
-- ============================
-- USUARIOS
INSERT INTO usuarios (username, password, nombre, email, "isAdmin")
VALUES ('admin', '$2b$10$IPPgQWKDY55Mvo62LvQ9Y.cJltDuU7G5roTFEh/Zt37XAUclC1F5O', 'Administrador', 'admin@horizonteazul.com', true)
ON CONFLICT (username) DO NOTHING;

-- SERVICIOS
INSERT INTO servicios (id, nombre, tipo_control) VALUES
    (1,  'Maleta extra 23kg',            'numero'),
    (2,  'Equipaje deportivo',           'numero'),
    (3,  'Instrumentos musicales',       'numero'),
    (4,  'Equipaje frágil',              'numero'),
    (5,  'Asiento XL',                   'texto'),
    (6,  'Acceso Sala VIP',              'booleano'),
    (7,  'Pack descanso (Manta/Antifaz)','booleano'),
    (8,  'Menú a bordo',                 'texto'),
    (9,  'Cambio de fecha flexible',     'booleano'),
    (10, 'Cancelación garantizada',      'booleano'),
    (11, 'Check-in prioritario',         'booleano'),
    (12, 'Fast Track (Control rápido)',  'booleano'),
    (13, 'Bus al destino (Enlace)',      'booleano'),
    (14, 'Transfer privado',             'booleano'),
    (15, 'Alquiler de coche (Días)',     'numero'),
    (16, 'Parking en aeropuerto (Días)', 'numero'),
    (17, 'Mascota en cabina',            'numero'),
    (18, 'Mascota en bodega',            'numero'),
    (19, 'Wi-Fi alta velocidad',         'booleano'),
    (20, 'Puerto USB/Enchufe',           'booleano')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

SELECT setval('servicios_id_seq', (SELECT MAX(id) FROM servicios));

-- VIAJES (sin precio_base)
INSERT INTO viajes (id, "paisOrigen", "aeropuertoOrigen", "iataOrigen", "paisDestino", "aeropuertoDestino", "iataDestino", img, descripcion) VALUES
(1, 'España',        'Valencia',   'VLC', 'Irlanda',  'Galway',          'GWY', 'https://images.ireland.com/thumbs/Images/galway/6fc964e86ea345409536504e19add100/standardlarge-desktop.jpg', 'Conecta con Galway y disfruta de sus calles coloridas, pubs tradicionales y paisajes atlánticos únicos.'),
(2, 'España',        'Madrid',     'MAD', 'Italia',   'Roma',            'FCO', 'https://www.bekiaviajes.com/images/ciudades/portada/0000/6-h.jpg',                                           'Vuela directo a Roma y descubre el Coliseo, la Fontana di Trevi y la gastronomía italiana.'),
(3, 'España',        'Barcelona',  'BCN', 'Francia',  'París',           'CDG', 'https://www.turium.es/wp-content/uploads/sites/4/2025/06/que-ver-paris-torre-eiffel-796x530.jpg',           'Conecta con París y disfruta de la Torre Eiffel, el Louvre y los bulevares parisinos.'),
(4, 'España',        'Valencia',   'VLC', 'Alemania', 'Berlín',          'BER', 'https://thishotel.es/wp-content/uploads/2021/01/berlin.jpg',                                                 'Explora Berlín con su vibrante arte urbano, historia y gastronomía multicultural.'),
(5, 'España',        'Sevilla',    'SVQ', 'Portugal', 'Lisboa',          'LIS', 'https://aunclicdelaaventura.com/wp-content/uploads/2021/11/Que-ver-en-Lisboa.jpg',                           'Descubre Lisboa y sus miradores, tranvías históricos y la cultura del fado.'),
(6, 'Estados Unidos','Nueva York', 'JFK', 'Canadá',   'Toronto',         'YYZ', 'https://www.grayline.com/wp-content/uploads/2023/11/shutterstock_2530655767-scaled.jpg', 'Cruza el continente y descubre Toronto, ciudad multicultural a orillas del lago Ontario.'),
(7, 'Alemania',      'Berlín',     'BER', 'México',   'Ciudad de México','MEX', 'https://images.musement.com/cover/0002/99/mexico-city-xl-jpg_header-198157.jpeg',                           'Descubre la riqueza cultural de CDMX, sus mercados, museos y gastronomía única en el mundo.'),
(8, 'España',        'Madrid',     'MAD', 'Egipto',   'Cairo',           'CAI', 'https://images.unsplash.com/photo-1539768942893-daf53e448371',                                               'Viaje inolvidable al antiguo Egipto: pirámides de Guiza, el Nilo y el Museo Egipcio.'),
(9, 'España',        'Madrid',     'MAD', 'Japón',    'Tokio',           'NRT', 'https://estaticos-cdn.prensaiberica.es/clip/ec9e7d0a-b746-4ffb-b91e-140a4f1ed122_original-libre-aspect-ratio_default_0.jpg', 'Explora la tierra del sol naciente: de Shinjuku y Shibuya hasta los templos de Kioto.')
ON CONFLICT (id) DO NOTHING;

SELECT setval('viajes_id_seq', (SELECT MAX(id) FROM viajes));

-- VUELOS
-- Vuelos pasados → estado 'completado' para que queden registrados
-- Vuelos futuros → estado 'programado'
INSERT INTO vuelos (viaje_id, "fecSalida", "horaSalida", "fecLlegada", "horaLlegada", "plazasTotales", "plazasDisponibles", precio_ajustado, tipo, estado) VALUES
-- Viaje 1: Valencia → Galway
(1, '2026-04-01', '08:00', '2026-04-01', '10:45', 150, 0, 160.89, 'ida',    'completado'),
(1, '2026-04-05', '14:00', '2026-04-05', '16:45', 150, 0, 140.00, 'vuelta', 'completado'),
(1, '2026-05-10', '08:00', '2026-05-10', '10:45', 150, 0, 160.89, 'ida',    'programado'),
(1, '2026-05-12', '08:00', '2026-05-12', '10:45', 150, 0, 160.89, 'ida',    'programado'),
(1, '2026-05-15', '14:00', '2026-05-15', '16:45', 150, 0, 140.00, 'vuelta', 'programado'),
(1, '2026-05-17', '14:00', '2026-05-17', '16:45', 150, 0, 140.00, 'vuelta', 'programado'),
-- Viaje 2: Madrid → Roma
(2, '2026-03-20', '10:00', '2026-03-20', '12:30', 180, 0, 120.00, 'ida',    'completado'),
(2, '2026-03-27', '20:00', '2026-03-27', '22:30', 180, 0, 115.00, 'vuelta', 'completado'),
(2, '2026-05-12', '10:00', '2026-05-12', '12:30', 180, 0, 120.00, 'ida',    'programado'),
(2, '2026-05-14', '10:00', '2026-05-14', '12:30', 180, 0, 120.00, 'ida',    'programado'),
(2, '2026-05-18', '20:00', '2026-05-18', '22:30', 180, 0, 115.00, 'vuelta', 'programado'),
(2, '2026-05-20', '20:00', '2026-05-20', '22:30', 180, 0, 115.00, 'vuelta', 'programado'),
-- Viaje 3: Barcelona → París
(3, '2026-06-01', '07:30', '2026-06-01', '09:45', 160, 0,  95.56, 'ida',    'programado'),
(3, '2026-06-08', '18:00', '2026-06-08', '20:15', 160, 0,  90.00, 'vuelta', 'programado'),
-- Viaje 4: Valencia → Berlín
(4, '2026-06-10', '06:45', '2026-06-10', '10:00', 150, 0, 130.00, 'ida',    'programado'),
(4, '2026-06-17', '19:00', '2026-06-17', '22:15', 150, 0, 125.00, 'vuelta', 'programado'),
-- Viaje 5: Sevilla → Lisboa
(5, '2026-05-20', '09:00', '2026-05-20', '10:15', 120, 0,  89.87, 'ida',    'programado'),
(5, '2026-05-27', '17:00', '2026-05-27', '18:15', 120, 0,  85.00, 'vuelta', 'programado'),
-- Viaje 6: Nueva York → Toronto
(6, '2026-07-04', '11:00', '2026-07-04', '12:30', 200, 0, 220.00, 'ida',    'programado'),
(6, '2026-07-11', '14:00', '2026-07-11', '15:30', 200, 0, 210.00, 'vuelta', 'programado'),
-- Viaje 7: Berlín → Ciudad de México
(7, '2026-08-01', '13:00', '2026-08-01', '22:00', 250, 0, 600.99, 'ida',    'programado'),
(7, '2026-08-15', '00:30', '2026-08-15', '18:00', 250, 0, 580.00, 'vuelta', 'programado'),
-- Viaje 8: Madrid → Cairo
(8, '2026-09-10', '06:00', '2026-09-10', '11:30', 200, 0, 450.00, 'ida',    'programado'),
(8, '2026-09-20', '13:00', '2026-09-20', '18:30', 200, 0, 430.00, 'vuelta', 'programado'),
-- Viaje 9: Madrid → Tokio
(9, '2026-10-01', '10:00', '2026-10-02', '06:00', 300, 0, 1100.00,'ida',    'programado'),
(9, '2026-10-15', '08:00', '2026-10-15', '14:00', 300, 0, 1050.00,'vuelta', 'programado')
ON CONFLICT DO NOTHING;

SELECT setval('vuelos_id_seq', (SELECT MAX(id) FROM vuelos));

-- VIAJE_SERVICIO
-- valor    → cantidad por defecto o descripción del servicio
-- incluido → true = viene gratis en el precio del vuelo
-- precio_extra → coste por unidad si el usuario lo añade (0 si incluido)
-- Cálculo en checkout: precio_extra × cantidad_solicitada_por_usuario
INSERT INTO viaje_servicio (viaje_id, servicio_id, valor, precio_extra, incluido, cantidad_incluida) VALUES
-- Viaje 1: Valencia → Galway (maleta solo de pago)
(1,  1,  '1',              40.00, false, 0),
(1,  11, 'true',            0.00, true,  0),
(1,  19, 'true',            0.00, true,  0),
(1,  13, 'true',           15.00, false, 0),
-- Viaje 2: Madrid → Roma (1 maleta incluida + opción pagar más)
(2,  1,  '1',               0.00, true,  1),   -- 1 maleta incluida gratis
(2,  1,  '1',              35.00, false, 0),   -- maletas adicionales 35€/ud
(2,  8,  'Menú Gourmet',   20.00, false, 0),
(2,  5,  'Ventanilla',      0.00, true,  0),
(2,  11, 'true',            0.00, true,  0),
-- Viaje 3: Barcelona → París
(3,  1,  '1',               0.00, true,  1),   -- 1 maleta incluida
(3,  1,  '1',              30.00, false, 0),   -- maletas adicionales 30€/ud
(3,  6,  'true',           25.00, false, 0),
(3,  14, 'true',           45.00, false, 0),
(3,  19, 'true',            0.00, true,  0),
-- Viaje 4: Valencia → Berlín
(4,  1,  '1',              35.00, false, 0),
(4,  2,  '1',              50.00, false, 0),
(4,  16, '1',              30.00, false, 0),
(4,  20, 'true',            0.00, true,  0),
-- Viaje 5: Sevilla → Lisboa
(5,  1,  '1',               0.00, true,  1),   -- 1 maleta incluida
(5,  1,  '1',              25.00, false, 0),   -- maletas adicionales 25€/ud
(5,  9,  'true',            0.00, true,  0),
(5,  20, 'true',            0.00, true,  0),
(5,  13, 'true',            0.00, true,  0),
-- Viaje 6: Nueva York → Toronto
(6,  1,  '2',               0.00, true,  2),   -- 2 maletas incluidas
(6,  1,  '1',              80.00, false, 0),   -- maletas adicionales 80€/ud
(6,  5,  'Asiento XL',     60.00, false, 0),
(6,  12, 'true',           20.00, false, 0),
(6,  6,  'true',            0.00, true,  0),
-- Viaje 7: Berlín → CDMX
(7,  1,  '2',               0.00, true,  2),   -- 2 maletas incluidas
(7,  1,  '1',              90.00, false, 0),   -- maletas adicionales 90€/ud
(7,  18, '1',             120.00, false, 0),
(7,  7,  'true',            0.00, true,  0),
(7,  6,  'true',            0.00, true,  0),
(7,  8,  'Menú Premium',    0.00, true,  0),
-- Viaje 8: Madrid → Cairo
(8,  1,  '2',               0.00, true,  2),   -- 2 maletas incluidas
(8,  6,  'true',            0.00, true,  0),
(8,  8,  'Pensión Completa', 0.00, true, 0),
(8,  14, 'true',           80.00, false, 0),
(8,  10, 'true',            0.00, true,  0),
-- Viaje 9: Madrid → Tokio
(9,  1,  '2',               0.00, true,  2),   -- 2 maletas incluidas
(9,  1,  '1',             100.00, false, 0),   -- maletas adicionales 100€/ud
(9,  5,  'Cama Business',   0.00, true,  0),
(9,  17, '1',             150.00, false, 0),
(9,  19, 'true',            0.00, true,  0),
(9,  6,  'true',            0.00, true,  0),
(9,  7,  'true',            0.00, true,  0);

SELECT setval('viaje_servicio_id_seq', (SELECT MAX(id) FROM viaje_servicio));

-- Actualizamos las plazas disponibles de cada vuelo

UPDATE vuelos v
SET "plazasDisponibles" = "plazasTotales" - (
    SELECT COALESCE(SUM(r.pasajeros), 0)
    FROM reservas r
    WHERE r.vuelo_id = v.id
    AND r.estado != 'cancelada'
);