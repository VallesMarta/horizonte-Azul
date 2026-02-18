-- Forzar la base de datos a usar UTF-8
ALTER DATABASE horizonteAzul CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE horizonteAzul;

-- Configurar la sesión para que el script se lea como UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
-- ============================
-- Usuarios
-- ============================
CREATE TABLE IF NOT EXISTS usuarios (
    id int AUTO_INCREMENT PRIMARY KEY,
    username varchar(50) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    nombre varchar(100),
    email varchar(100) NOT NULL UNIQUE,
    isAdmin boolean DEFAULT FALSE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Viajes
-- ============================
CREATE TABLE IF NOT EXISTS viajes (
    id int AUTO_INCREMENT PRIMARY KEY,
    paisOrigen varchar(100) NOT NULL,            
    aeropuertoOrigen varchar(100) NOT NULL,
    horaSalida TIME DEFAULT '00:00:00',                    
    paisDestino varchar(100) NOT NULL,           
    aeropuertoDestino varchar(100) NOT NULL,
    horaLlegada TIME DEFAULT '00:00:00',                   
    precio decimal(10,2) NOT NULL DEFAULT 0.00, 
    img varchar(255),
    descripcion text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Servicios
-- ============================
CREATE TABLE IF NOT EXISTS servicios (
    id int AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(100) UNIQUE, 
    tipo_control ENUM('numero', 'texto', 'booleano') NOT NULL DEFAULT 'texto'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Relación Viaje-Servicio (Muchos a Muchos)
-- ============================
CREATE TABLE IF NOT EXISTS viaje_servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    viaje_id INT NOT NULL,
    servicio_id INT NOT NULL,
    valor VARCHAR(255),
    precio_extra DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (viaje_id) REFERENCES viajes(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Reservas
-- ============================
CREATE TABLE IF NOT EXISTS reservas (
    id int AUTO_INCREMENT PRIMARY KEY,
    usuario_id int NOT NULL,
    viaje_id int NOT NULL,
    fecCompra timestamp DEFAULT CURRENT_TIMESTAMP,
    fecSalida DATE,
    pasajeros int DEFAULT 1 CHECK (pasajeros >= 1),
    estado ENUM('pendiente','confirmada','realizada','cancelada') DEFAULT 'pendiente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (viaje_id) REFERENCES viajes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Wishlist (Muchos a Muchos Usuario-Viaje)
-- ============================
CREATE TABLE IF NOT EXISTS wishlist (
    usuario_id int,
    viaje_id int,
    PRIMARY KEY (usuario_id, viaje_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (viaje_id) REFERENCES viajes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Métodos de Pago Guardados 
-- ============================
CREATE TABLE IF NOT EXISTS metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    last4 VARCHAR(4) NOT NULL,
    marca VARCHAR(20), -- Visa, Mastercard, etc.
    token_simulado VARCHAR(255), 
    fecha_guardado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================
-- Pagos (Vinculado a la Reserva y opcionalmente a la Tarjeta Guardada)
-- ============================
CREATE TABLE IF NOT EXISTS pagos (
    id int AUTO_INCREMENT PRIMARY KEY,
    reserva_id int NOT NULL,
    usuario_id int NOT NULL,
    metodo_pago_id int NULL,           -- Referencia a metodos_pago si el usuario la guardó
    monto decimal(10,2) NOT NULL,
    metodo ENUM('tarjeta', 'transferencia', 'paypal') DEFAULT 'tarjeta',
    tipo_tarjeta VARCHAR(20) NULL,      -- Aquí guardaremos 'Visa', 'Mastercard', etc.
    estado ENUM('exitoso', 'fallido') DEFAULT 'exitoso',
    fecha_pago timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (metodo_pago_id) REFERENCES metodos_pago(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Insertamos al admin para tener acceso de primeras a la web con ese usuario
-- ============================
INSERT INTO usuarios (username, password, nombre, email, isAdmin)
VALUES (
    'admin',
    '$2b$10$IPPgQWKDY55Mvo62LvQ9Y.cJltDuU7G5roTFEh/Zt37XAUclC1F5O', -- contraseña hasheada
    'Administrador',
    'admin@horizonteazul.com',
    true
);

-- ============================
-- Insertamos viajes
-- ============================
INSERT INTO viajes (paisOrigen,aeropuertoOrigen,horaSalida,paisDestino,aeropuertoDestino,horaLlegada,precio,img,descripcion) VALUES
    ('España','Valencia','06:06:00','Irlanda','Galway','08:48:00',160.89,'https://images.ireland.com/thumbs/Images/galway/6fc964e86ea345409536504e19add100/standardlarge-desktop.jpg','Conecta con Galway y disfruta de sus calles coloridas, música tradicional irlandesa y el encanto de la costa atlántica.'),
    ('España','Madrid','00:00:00','Italia','Roma','00:00:00',120.00,'https://www.bekiaviajes.com/images/ciudades/portada/0000/6-h.jpg','Vuela directo a Roma y descubre el Coliseo, la Fontana di Trevi y su gastronomía auténtica.'),
    ('España','Barcelona','00:00:00','Francia','París','00:00:00',95.56,'https://www.turium.es/wp-content/uploads/sites/4/2025/06/que-ver-paris-torre-eiffel-796x530.jpg','Conecta con París y disfruta de la Torre Eiffel, el Louvre y paseos por el Sena.'),
    ('España','Valencia','00:00:00','Alemania','Berlín','00:00:00',130.00,'https://thishotel.es/wp-content/uploads/2021/01/berlin.jpg','Explora Berlín con su vibrante arte urbano, historia y la famosa Puerta de Brandeburgo.'),
    ('España','Sevilla','00:00:00','Portugal','Lisboa','00:00:00',89.87,'https://aunclicdelaaventura.com/wp-content/uploads/2021/11/Que-ver-en-Lisboa.jpg','Descubre Lisboa, sus miradores, calles empedradas y la música del fado en vivo.'),
    ('Estados Unidos','Nueva York','00:00:00','Canadá','Toronto','00:00:00',220.00,'https://pohcdn.com/sites/default/files/styles/node__blog_post__bp_banner/public/2021-05/Nathan%20-Phillips-Square.jpg','Cruza el continente y descubre Toronto, sus rascacielos y el famoso Niagara Falls cercano.'),
    ('Alemania','Berlín','00:00:00','México','Ciudad de México','00:00:00',600.99,'https://images.musement.com/cover/0002/99/mexico-city-xl-jpg_header-198157.jpeg','Descubre la riqueza cultural de CDMX, sus museos, plazas y gastronomía única.'),
    ('España', 'Madrid', '08:00:00', 'Egipto', 'Cairo', '14:30:00', 1450.00, 'https://images.unsplash.com/photo-1539768942893-daf53e448371', 'Viaje inolvidable al antiguo Egipto. Incluye vuelo a Cairo, conexión a Luxor y crucero de 4 noches por el Nilo visitando templos históricos.'),
    ('España', 'Madrid', '13:00:00', 'Japón', 'Tokio', '09:00:00', 1100.00, 'https://estaticos-cdn.prensaiberica.es/clip/ec9e7d0a-b746-4ffb-b91e-140a4f1ed122_original-libre-aspect-ratio_default_0.jpg', 'Explora la tierra del sol naciente. De los rascacielos de Shinjuku a los templos milenarios de Kioto. Incluye JR Pass para trenes bala.');

-- ============================
-- Insertamos servicios
-- ============================
INSERT INTO servicios (nombre, tipo_control) VALUES 
    -- EQUIPAJE
    ('Maleta extra 23kg', 'numero'),
    ('Equipaje deportivo', 'numero'),
    ('Instrumentos musicales', 'numero'),
    ('Equipaje frágil', 'numero'),

    -- ASIENTOS Y CONFORT
    ('Asiento XL', 'texto'), 
    ('Acceso Sala VIP', 'booleano'),
    ('Pack descanso (Manta/Antifaz)', 'booleano'),
    ('Menú a bordo', 'texto'),

    -- FLEXIBILIDAD Y AEROPUERTO
    ('Cambio de fecha flexible', 'booleano'),
    ('Cancelación garantizada', 'booleano'),
    ('Check-in prioritario', 'booleano'),
    ('Fast Track (Control rápido)', 'booleano'),

    -- TRASLADOS Y DESTINO (Intermodal)
    ('Bus al destino (Enlace)', 'booleano'),
    ('Transfer privado', 'booleano'),
    ('Alquiler de coche (Días)', 'numero'),
    ('Parking en aeropuerto (Días)', 'numero'),

    -- MASCOTAS
    ('Mascota en cabina', 'numero'),
    ('Mascota en bodega', 'numero'),    

    -- TECNOLOGÍA
    ('Wi-Fi alta velocidad', 'booleano'),
    ('Puerto USB/Enchufe', 'booleano');