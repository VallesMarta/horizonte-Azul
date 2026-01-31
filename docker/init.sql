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
);

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
);

-- ============================
-- Servicios
-- ============================
CREATE TABLE IF NOT EXISTS servicios (
    id int AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(100) UNIQUE, 
    tipo_control ENUM('numero', 'texto', 'booleano') NOT NULL DEFAULT 'texto'
);

-- ============================
-- Relación Viaje-Servicio (Muchos a Muchos)
-- ============================
CREATE TABLE IF NOT EXISTS viaje_servicio (
    viaje_id int,
    servicio_id int,
    valor varchar(255), 
    precio_extra decimal(10,2) DEFAULT 0.00, 
    PRIMARY KEY (viaje_id, servicio_id),
    FOREIGN KEY (viaje_id) REFERENCES viajes(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
);

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
);

-- ============================
-- Wishlist (Muchos a Muchos Usuario-Viaje)
-- ============================
CREATE TABLE IF NOT EXISTS wishlist (
    usuario_id int,
    viaje_id int,
    PRIMARY KEY (usuario_id, viaje_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (viaje_id) REFERENCES viajes(id) ON DELETE CASCADE
);

-- ============================
-- Insertamos al admin para tener acceso de primeras a la web con ese usuario
-- ============================
INSERT intO usuarios (username, password, nombre, email, isAdmin)
VALUES (
    'admin',
    '$2b$10$IPPgQWKDY55Mvo62LvQ9Y.cJltDuU7G5roTFEh/Zt37XAUclC1F5O', -- contraseña hasheada
    'Administrador',
    'admin@horizonteazul.com',
    true
);