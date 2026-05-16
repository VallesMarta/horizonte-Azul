-- ============================
-- INSERTS DATOS
-- ============================
-- USUARIOS
INSERT INTO usuarios (username, password, nombre, email, "isAdmin")
VALUES ('admin', '$2b$10$IPPgQWKDY55Mvo62LvQ9Y.cJltDuU7G5roTFEh/Zt37XAUclC1F5O', 'Administrador', 'info.horizonteazul@gmail.com', true)
ON CONFLICT (username) DO NOTHING;

SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));
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

-- VIAJES 
INSERT INTO viajes (id, "paisOrigen", "aeropuertoOrigen", "iataOrigen", "paisDestino", "aeropuertoDestino", "iataDestino", img, descripcion) VALUES
(1, 'España', 'Valencia', 'VLC', 'Irlanda', 'Galway', 'GWY', 'https://images.ireland.com/thumbs/Images/galway/6fc964e86ea345409536504e19add100/standardlarge-desktop.jpg', 'Conecta con Galway y disfruta de sus calles coloridas, pubs tradicionales y paisajes atlánticos únicos.'),
(2, 'España', 'Madrid', 'MAD', 'Italia', 'Roma', 'FCO', 'https://www.bekiaviajes.com/images/ciudades/portada/0000/6-h.jpg', 'Vuela directo a Roma y descubre el Coliseo, la Fontana di Trevi y la gastronomía italiana.'),
(3, 'España', 'Barcelona', 'BCN', 'Francia', 'París', 'CDG', 'https://res.cloudinary.com/dtljonz0f/image/upload/c_fill,w_3840,g_auto/f_auto/q_auto:eco/v1/gc-v1/paris/paris_non-ed_shutterstock_2614817413_mncfps?_a=BAVAZGDY0', 'Conecta con París y disfruta de la Torre Eiffel, el Louvre y los bulevares parisinos.'),
(4, 'España', 'Valencia', 'VLC', 'Alemania', 'Berlín', 'BER', 'https://www.edreams.es/blog/wp-content/uploads/sites/5/2024/01/Berli%CC%81n.jpg.webp', 'Explora Berlín con su vibrante arte urbano, historia y gastronomía multicultural.'),
(5, 'España', 'Sevilla', 'SVQ', 'Portugal', 'Lisboa', 'LIS', 'https://prd-webrepository.firabarcelona.com/wp-content/uploads/sites/69/2024/12/19110908/istock-1221460597.jpg', 'Descubre Lisboa y sus miradores, tranvías históricos y la cultura del fado.'),
(6, 'Estados Unidos', 'Nueva York', 'JFK', 'Canadá', 'Toronto', 'YYZ', 'https://www.grayline.com/wp-content/uploads/2023/11/shutterstock_2530655767-scaled.jpg', 'Cruza el continente y descubre Toronto, ciudad multicultural a orillas del lago Ontario.'),
(7, 'Alemania', 'Berlín', 'BER', 'México', 'Ciudad de México', 'MEX', 'https://images.musement.com/cover/0002/99/mexico-city-xl-jpg_header-198157.jpeg', 'Descubre la riqueza cultural de CDMX, sus mercados, museos y gastronomía única en el mundo.'),
(8, 'España', 'Madrid', 'MAD', 'Egipto', 'Cairo', 'CAI', 'https://images.unsplash.com/photo-1539768942893-daf53e448371', 'Viaje inolvidable al antiguo Egipto: pirámides de Guiza, el Nilo y el Museo Egipcio.'),
(9, 'España', 'Madrid', 'MAD', 'Japón', 'Tokio', 'NRT', 'https://estaticos-cdn.prensaiberica.es/clip/ec9e7d0a-b746-4ffb-b91e-140a4f1ed122_original-libre-aspect-ratio_default_0.jpg', 'Explora la tierra del sol naciente: de Shinjuku y Shibuya hasta los templos de Kioto.'),
(10, 'Estados Unidos', 'Miami', 'MIA', 'España', 'Madrid', 'MAD', 'https://images.squarespace-cdn.com/content/v1/5a86b05bcf81e0af04936cc7/1556041925114-OU0OGN3KR1L83XI3OXBO/que-ver-en-madrid-plaza-mayor.jpg', 'Cruza el Atlántico desde las playas de Florida hacia el corazón y la cultura de Madrid.'),
(11, 'Estados Unidos', 'Los Ángeles', 'LAX', 'Japón', 'Tokio', 'NRT', 'https://media.traveler.es/photos/64e32c849ab0bbad14796953/3:2/w_6000,h_4000,c_limit/tokyoGettyImages-1031467664.jpeg', 'Ruta Transpacífica directa desde la costa oeste americana hasta la metrópolis de Tokio.'),
(12, 'Estados Unidos', 'Nueva York', 'JFK', 'Reino Unido', 'Londres', 'LHR', 'https://img.nh-hotels.net/8yYbq/Y7nAz/original/United_Kingdom_London_Tower_Bridge-1404x936.jpg?output-quality=70&resize=*:*&background-color=white', 'La clásica ruta de negocios y turismo sobre el Atlántico Norte: de Nueva York a Londres.'),
(14, 'Reino Unido', 'Londres', 'LHR', 'Estados Unidos', 'Los Ángeles', 'LAX', 'https://www.hola.com/horizon/landscape/d6044635c60e-los-angeles-t.jpg', 'Conecta la capital británica con las colinas de Hollywood y la costa de California.'),
(13, 'Reino Unido', 'Londres', 'LHR', 'España', 'Barcelona', 'BCN', 'https://www.outlooktravelmag.com/media/barcelona-tg.png', 'Escápate del clima británico directa al Mediterráneo, la arquitectura de Gaudí y las playas.'),
(15, 'Irlanda', 'Galway', 'GWY', 'Francia', 'París', 'CDG', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', 'Viaja desde la costa atlántica irlandesa hasta la romántica y artística ciudad de París.'),
(16, 'Francia', 'París', 'CDG', 'Japón', 'Tokio', 'NRT', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', 'Vuelo intercontinental de largo alcance uniendo los museos parisinos con la tecnología nipona.'),
(18, 'Italia', 'Roma', 'FCO', 'España', 'Madrid', 'MAD', 'https://images.unsplash.com/photo-1543783207-ec64e4d95325', 'Ruta mediterránea uniendo dos de las capitales latinas con más historia, arte y vida urbana.'),
(17, 'Francia', 'París', 'CDG', 'España', 'Valencia', 'VLC', 'https://singularstays.com/wp-content/uploads/2024/02/ciudad-artes-y-ciencias-valencia.webp', 'Ruta turística directa desde la capital del Sena hacia las playas y las artes de Valencia.'),
(19, 'Alemania', 'Berlín', 'BER', 'España', 'Sevilla', 'SVQ', 'https://images.winalist.com/blog/wp-content/uploads/2025/05/07154809/adobestock-167195068-1500x1039.jpeg', 'Conecta directamente el norte de Europa con el sol, el flamenco y el arte de Andalucía.'),
(20, 'México', 'Ciudad de México', 'MEX', 'España', 'Madrid', 'MAD', 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b', 'El gran puente de habla hispana: conecta el Valle de México con la capital española.'),
(21, 'España', 'Barcelona', 'BCN', 'Emiratos Árabes', 'Dubái', 'DXB', 'https://res.klook.com/image/upload/fl_lossy.progressive,q_60/v1760437946/destination/vovea0rrgjojr9pgdp7b.jpg', 'Dubái es una ciudad moderna y lujosa de los Emiratos Árabes Unidos, famosa por sus rascacielos impresionantes, centros comerciales gigantes, playas, desierto y vida nocturna. Combina tradición árabe con tecnología y arquitectura futurista, destacando lugares como el Burj Khalifa, el edificio más alto del mundo, y las islas artificiales de Palm Jumeirah. Es un destino ideal para disfrutar de compras, safaris por el desierto, hoteles de lujo y experiencias únicas durante todo el año gracias a su clima cálido.')
ON CONFLICT (id) DO NOTHING;

SELECT setval('viajes_id_seq', (SELECT MAX(id) FROM viajes));

-- VUELOS
-- Vuelos pasados → estado 'completado' para que queden registrados
-- Vuelos futuros → estado 'programado'
INSERT INTO vuelos (viaje_id, "fecSalida", "horaSalida", "fecLlegada", "horaLlegada", "plazasTotales", "plazasDisponibles", precio_ajustado, tipo, estado) VALUES
(1, '2025-01-15', '08:00', '2025-01-15', '10:45', 150, 150, 120.00, 'ida', 'completado'),
(1, '2025-01-22', '14:00', '2025-01-22', '16:45', 150, 150, 115.00, 'vuelta', 'completado'),
(2, '2025-02-10', '10:00', '2025-02-10', '12:30', 180, 180, 95.00, 'ida', 'completado'),
(2, '2025-02-17', '20:00', '2025-02-17', '22:30', 180, 180, 89.00, 'vuelta', 'completado'),
(3, '2025-03-05', '07:30', '2025-03-05', '09:45', 160, 160, 75.00, 'ida', 'completado'),
(3, '2025-03-12', '18:00', '2025-03-12', '20:15', 160, 160, 70.00, 'vuelta', 'completado'),
(4, '2025-04-01', '06:45', '2025-04-01', '10:00', 150, 150, 110.00, 'ida', 'completado'),
(4, '2025-04-08', '19:00', '2025-04-08', '22:15', 150, 150, 105.00, 'vuelta', 'completado'),
(5, '2025-05-12', '09:00', '2025-05-12', '10:15', 120, 120, 65.00, 'ida', 'completado'),
(5, '2025-05-19', '17:00', '2025-05-19', '18:15', 120, 120, 59.00, 'vuelta', 'completado'),
(6, '2025-06-14', '11:00', '2025-06-14', '12:30', 200, 200, 185.00, 'ida', 'completado'),
(6, '2025-06-21', '15:00', '2025-06-21', '16:30', 200, 200, 175.00, 'vuelta', 'completado'),
(7, '2025-07-01', '13:00', '2025-07-01', '22:00', 250, 250, 540.00, 'ida', 'completado'),
(7, '2025-07-15', '00:30', '2025-07-15', '18:00', 250, 250, 520.00, 'vuelta', 'completado'),
(8, '2025-08-10', '06:00', '2025-08-10', '11:30', 200, 200, 399.00, 'ida', 'completado'),
(8, '2025-08-20', '13:00', '2025-08-20', '18:30', 200, 200, 380.00, 'vuelta', 'completado'),
(9, '2025-09-01', '10:00', '2025-09-02', '06:00', 300, 300, 950.00, 'ida', 'completado'),
(9, '2025-09-15', '08:00', '2025-09-15', '14:00', 300, 300, 910.00, 'vuelta', 'completado'),
(10, '2025-10-05', '12:00', '2025-10-06', '02:00', 250, 250, 450.00, 'ida', 'completado'),
(10, '2025-10-12', '08:30', '2025-10-12', '20:30', 250, 250, 420.00, 'vuelta', 'completado'),
(11, '2025-10-18', '09:15', '2025-10-19', '04:30', 280, 280, 750.00, 'ida', 'completado'),
(11, '2025-10-25', '11:00', '2025-10-25', '18:15', 280, 280, 710.00, 'vuelta', 'completado'),
(12, '2025-11-02', '18:30', '2025-11-03', '06:00', 250, 250, 510.00, 'ida', 'completado'),
(12, '2025-11-09', '14:00', '2025-11-10', '01:30', 250, 250, 490.00, 'vuelta', 'completado'),
(13, '2025-11-15', '07:00', '2025-11-15', '09:15', 150, 150, 85.00, 'ida', 'completado'),
(13, '2025-11-22', '12:00', '2025-11-22', '14:15', 150, 150, 79.00, 'vuelta', 'completado'),
(14, '2025-11-28', '11:30', '2025-11-28', '21:00', 280, 280, 620.00, 'ida', 'completado'),
(14, '2025-12-05', '23:00', '2025-12-06', '10:30', 280, 280, 599.00, 'vuelta', 'completado'),
(15, '2025-12-01', '08:00', '2025-12-01', '10:15', 120, 120, 95.00, 'ida', 'completado'),
(15, '2025-12-08', '13:00', '2025-12-08', '15:15', 120, 120, 89.00, 'vuelta', 'completado'),
(16, '2025-12-10', '13:00', '2025-12-11', '09:30', 300, 300, 890.00, 'ida', 'completado'),
(16, '2025-12-17', '22:00', '2025-12-18', '18:00', 300, 300, 850.00, 'vuelta', 'completado'),
(17, '2025-12-12', '07:30', '2025-12-12', '09:40', 150, 150, 68.00, 'ida', 'completado'),
(17, '2025-12-19', '15:00', '2025-12-19', '17:10', 150, 150, 59.00, 'vuelta', 'completado'),
(18, '2025-12-15', '09:00', '2025-12-15', '11:15', 180, 180, 74.00, 'ida', 'completado'),
(18, '2025-12-22', '18:00', '2025-12-22', '20:15', 180, 180, 69.00, 'vuelta', 'completado'),
(19, '2025-12-18', '06:00', '2025-12-18', '09:30', 150, 150, 110.00, 'ida', 'completado'),
(19, '2025-12-23', '14:00', '2025-12-23', '17:30', 150, 150, 99.00, 'vuelta', 'completado'),
(20, '2025-12-20', '12:30', '2025-12-21', '06:00', 300, 300, 580.00, 'ida', 'completado'),
(20, '2025-12-27', '13:00', '2025-12-27', '22:30', 300, 300, 540.00, 'vuelta', 'completado'),
(21, '2025-12-22', '02:00', '2025-12-22', '08:45', 250, 250, 640.00, 'ida', 'completado'),
(21, '2025-12-29', '16:00', '2025-12-29', '23:15', 250, 250, 610.00, 'vuelta', 'completado'),
(1, '2026-01-10', '08:00', '2026-01-10', '10:45', 150, 150, 130.00, 'ida', 'completado'),
(1, '2026-01-17', '14:00', '2026-01-17', '16:45', 150, 150, 125.00, 'vuelta', 'completado'),
(2, '2026-01-20', '10:00', '2026-01-20', '12:30', 180, 180, 105.00, 'ida', 'completado'),
(2, '2026-01-27', '20:00', '2026-01-27', '22:30', 180, 180, 99.00, 'vuelta', 'completado'),
(6, '2026-02-05', '11:00', '2026-02-05', '12:30', 200, 200, 190.00, 'ida', 'completado'),
(6, '2026-02-12', '14:00', '2026-02-12', '15:30', 200, 200, 185.00, 'vuelta', 'completado'),
(10, '2026-02-15', '12:00', '2026-02-16', '02:00', 250, 250, 480.00, 'ida', 'completado'),
(10, '2026-02-22', '08:30', '2026-02-22', '20:30', 250, 250, 450.00, 'vuelta', 'completado'),
(11, '2026-03-02', '09:15', '2026-03-03', '04:30', 280, 280, 790.00, 'ida', 'completado'),
(11, '2026-03-09', '11:00', '2026-03-09', '18:15', 280, 280, 740.00, 'vuelta', 'completado'),
(13, '2026-03-15', '07:00', '2026-03-15', '09:15', 150, 150, 99.00, 'ida', 'completado'),
(13, '2026-03-22', '12:00', '2026-03-22', '14:15', 150, 150, 89.00, 'vuelta', 'completado'),
(16, '2026-04-01', '13:00', '2026-04-02', '09:30', 300, 300, 920.00, 'ida', 'completado'),
(16, '2026-04-08', '22:00', '2026-04-09', '18:00', 300, 300, 890.00, 'vuelta', 'completado'),
(20, '2026-04-10', '12:30', '2026-04-11', '06:00', 300, 300, 610.00, 'ida', 'completado'),
(20, '2026-04-17', '13:00', '2026-04-17', '22:30', 300, 300, 580.00, 'vuelta', 'completado'),
(1, '2026-05-10', '08:00', '2026-05-10', '10:45', 150, 150, 160.89, 'ida', 'completado'),
(1, '2026-05-12', '08:00', '2026-05-12', '10:45', 150, 150, 160.89, 'ida', 'completado'),
(1, '2026-05-15', '14:00', '2026-05-15', '16:45', 150, 150, 140.00, 'vuelta', 'completado'),
(2, '2026-05-16', '15:00', '2026-05-16', '17:30', 180, 180, 150.00, 'ida', 'abordando'),
(3, '2026-05-16', '16:00', '2026-05-16', '18:15', 160, 160, 110.00, 'ida', 'en_vuelo'),
(1, '2026-05-16', '17:00', '2026-05-16', '19:30', 150, 150, 120.00, 'ida', 'programado'),
(1, '2026-05-17', '14:00', '2026-05-17', '16:45', 150, 150, 140.00, 'vuelta', 'programado'),
(2, '2026-05-16', '16:00', '2026-05-16', '18:30', 180, 180, 95.00, 'ida', 'programado'),
(3, '2026-05-16', '13:00', '2026-05-16', '15:30', 160, 160, 85.00, 'vuelta', 'programado'),
(4, '2026-05-16', '22:00', '2026-05-16', '23:45', 150, 150, 105.00, 'vuelta', 'programado'),
(2, '2026-05-18', '20:00', '2026-05-18', '22:30', 180, 180, 115.00, 'vuelta', 'programado'),
(5, '2026-05-20', '09:00', '2026-05-20', '10:15', 120, 120, 89.87, 'ida', 'programado'),
(4, '2026-05-22', '10:00', '2026-05-22', '13:15', 150, 150, 125.00, 'ida', 'cancelado'),
(5, '2026-05-27', '17:00', '2026-05-27', '18:15', 120, 120, 85.00, 'vuelta', 'programado'),
(5, '2026-05-28', '12:15', '2026-05-28', '14:30', 120, 120, 140.00, 'ida', 'programado'),
(6, '2026-05-28', '12:40', '2026-05-28', '15:00', 200, 200, 185.00, 'ida', 'programado'),
(7, '2026-05-28', '11:00', '2026-05-28', '14:00', 250, 250, 320.00, 'ida', 'programado'),
(8, '2026-05-28', '09:00', '2026-05-28', '11:30', 150, 150, 99.00, 'vuelta','programado'),
(9, '2026-05-28', '15:30', '2026-05-28', '18:00', 180, 180, 115.00, 'vuelta', 'programado'),
(1, '2026-06-05', '08:00', '2026-06-05', '10:45', 150, 150, 145.00, 'ida', 'programado'),
(1, '2026-06-12', '14:00', '2026-06-12', '16:45', 150, 150, 135.00, 'vuelta', 'programado'),
(2, '2026-06-15', '10:00', '2026-06-15', '12:30', 180, 180, 115.00, 'ida', 'programado'),
(2, '2026-06-22', '20:00', '2026-06-22', '22:30', 180, 180, 110.00, 'vuelta', 'programado'),
(3, '2026-07-01', '07:30', '2026-07-01', '09:45', 160, 160, 99.00, 'ida', 'programado'),
(3, '2026-07-08', '18:00', '2026-07-08', '20:15', 160, 160, 95.00, 'vuelta', 'programado'),
(4, '2026-07-10', '06:45', '2026-07-10', '10:00', 150, 150, 135.00, 'ida', 'programado'),
(4, '2026-07-17', '19:00', '2026-07-17', '22:15', 150, 150, 125.00, 'vuelta', 'programado'),
(6, '2026-08-01', '11:00', '2026-08-01', '12:30', 200, 200, 210.00, 'ida', 'programado'),
(6, '2026-08-08', '15:00', '2026-08-08', '16:30', 200, 200, 199.00, 'vuelta', 'programado'),
(7, '2026-08-15', '13:00', '2026-08-15', '22:00', 250, 250, 599.00, 'ida', 'programado'),
(7, '2026-08-29', '00:30', '2026-08-29', '18:00', 250, 250, 570.00, 'vuelta', 'programado'),
(8, '2026-09-05', '06:00', '2026-09-05', '11:30', 200, 200, 420.00, 'ida', 'programado'),
(8, '2026-09-15', '13:00', '2026-09-15', '18:30', 200, 200, 399.00, 'vuelta', 'programado'),
(9, '2026-10-01', '10:00', '2026-10-02', '06:00', 300, 300, 1100.00, 'ida', 'programado'),
(9, '2026-10-15', '08:00', '2026-10-15', '14:00', 300, 300, 1050.00, 'vuelta', 'programado'),
(10, '2026-10-10', '12:00', '2026-10-11', '02:00', 250, 250, 510.00, 'ida', 'programado'),
(10, '2026-10-17', '08:30', '2026-10-17', '20:30', 250, 250, 480.00, 'vuelta', 'programado'),
(11, '2026-11-01', '09:15', '2026-11-02', '04:30', 280, 280, 820.00, 'ida', 'programado'),
(11, '2026-11-08', '11:00', '2026-11-08', '18:15', 280, 280, 790.00, 'vuelta', 'programado'),
(12, '2026-11-12', '18:30', '2026-11-13', '06:00', 250, 250, 540.00, 'ida', 'programado'),
(12, '2026-11-19', '14:00', '2026-11-20', '01:30', 250, 250, 510.00, 'vuelta', 'programado'),
(13, '2026-12-01', '07:00', '2026-12-01', '09:15', 150, 150, 110.00, 'ida', 'programado'),
(13, '2026-12-08', '12:00', '2026-12-08', '14:15', 150, 150, 99.00, 'vuelta', 'programado'),
(14, '2026-12-10', '11:30', '2026-12-10', '21:00', 280, 280, 650.00, 'ida', 'programado'),
(14, '2026-12-17', '23:00', '2026-12-18', '10:30', 280, 280, 620.00, 'vuelta', 'programado'),
(15, '2026-12-15', '08:00', '2026-12-15', '10:15', 120, 120, 115.00, 'ida', 'programado'),
(15, '2026-12-22', '13:00', '2026-12-22', '15:15', 120, 120, 105.00, 'vuelta', 'programado'),
(16, '2027-01-10', '13:00', '2027-01-11', '09:30', 300, 300, 950.00, 'ida', 'programado'),
(16, '2027-01-17', '22:00', '2027-01-18', '18:00', 300, 300, 899.00, 'vuelta', 'programado'),
(17, '2027-01-24', '07:30', '2027-01-24', '09:40', 150, 150, 75.00, 'ida', 'programado'),
(17, '2027-01-31', '15:00', '2027-01-31', '17:10', 150, 150, 69.00, 'vuelta', 'programado'),
(18, '2027-02-05', '09:00', '2027-02-05', '11:15', 180, 180, 85.00, 'ida', 'programado'),
(18, '2027-02-12', '18:00', '2027-02-12', '20:15', 180, 180, 79.00, 'vuelta', 'programado'),
(19, '2027-02-20', '06:00', '2027-02-20', '09:30', 150, 150, 125.00, 'ida', 'programado'),
(19, '2027-02-27', '14:00', '2027-02-27', '17:30', 150, 150, 115.00, 'vuelta', 'programado'),
(20, '2027-03-05', '12:30', '2027-03-06', '06:00', 300, 300, 640.00, 'ida', 'programado'),
(20, '2027-03-12', '13:00', '2027-03-12', '22:30', 300, 300, 599.00, 'vuelta', 'programado'),
(21, '2027-03-20', '02:00', '2027-03-20', '08:45', 250, 250, 690.00, 'ida', 'programado'),
(21, '2027-03-27', '16:00', '2027-03-27', '23:15', 250, 250, 650.00, 'vuelta', 'programado'),
(1, '2027-04-05', '08:00', '2027-04-05', '10:45', 150, 150, 150.00, 'ida', 'programado'),
(1, '2027-04-12', '14:00', '2027-04-12', '16:45', 150, 150, 140.00, 'vuelta', 'programado'),
(2, '2027-04-18', '10:00', '2027-04-18', '12:30', 180, 180, 120.00, 'ida', 'programado'),
(2, '2027-04-25', '20:00', '2027-04-25', '22:30', 180, 180, 115.00, 'vuelta', 'programado'),
(3, '2027-05-02', '07:30', '2027-05-02', '09:45', 160, 160, 105.00, 'ida', 'programado'),
(3, '2027-05-09', '18:00', '2027-05-09', '20:15', 160, 160, 99.00, 'vuelta', 'programado'),
(9, '2027-05-15', '10:00', '2027-05-16', '06:00', 300, 300, 1200.00, 'ida', 'programado'),
(9, '2027-05-29', '08:00', '2027-05-29', '14:00', 300, 300, 1150.00, 'vuelta', 'programado'),
(10, '2027-06-01', '12:00', '2027-06-02', '02:00', 250, 250, 530.00, 'ida', 'programado'),
(10, '2027-06-08', '08:30', '2027-06-08', '20:30', 250, 250, 499.00, 'vuelta', 'programado'),
(14, '2027-06-12', '11:30', '2027-06-12', '21:00', 280, 280, 680.00, 'ida', 'programado'),
(14, '2027-06-19', '23:00', '2027-06-20', '10:30', 280, 280, 640.00, 'vuelta', 'programado')
ON CONFLICT DO NOTHING;

SELECT setval('vuelos_id_seq', (SELECT MAX(id) FROM vuelos));

-- VIAJE_SERVICIO
-- valor    → cantidad por defecto o descripción del servicio
-- incluido → true = viene gratis en el precio del vuelo
-- precio_extra → coste por unidad si el usuario lo añade (0 si incluido)
-- Cálculo en checkout: precio_extra × cantidad_solicitada_por_usuario
INSERT INTO viaje_servicio (viaje_id, servicio_id, valor, precio_extra, incluido, cantidad_incluida) VALUES

-- Viaje 1: Valencia → Galway
(1, 1, '1', 40.00, false, 0),       -- Equipaje de bodega (Pago)
(1, 11, 'true', 0.00, true, 0),     -- Wifi Básico Incluido
(1, 19, 'true', 0.00, true, 0),     -- Check-in online incluido
(1, 13, 'true', 15.00, false, 0),   -- Embarque prioritario

-- Viaje 2: Madrid → Roma
(2, 1, '1', 0.00, true, 1),         -- 1ª Maleta Incluida gratis
(2, 1, '1', 35.00, false, 0),        -- Maletas adicionales de pago
(2, 8, 'Menú Gourmet', 20.00, false, 0),
(2, 5, 'Ventanilla', 0.00, true, 0),
(2, 11, 'true', 0.00, true, 0),     -- Wifi incluido

-- Viaje 3: Barcelona → París
(3, 1, '1', 0.00, true, 1),         -- 1 Maleta incluida
(3, 1, '1', 30.00, false, 0),        -- Maletas adicionales
(3, 6, 'true', 25.00, false, 0),    -- Acceso a Sala VIP
(3, 14, 'true', 45.00, false, 0),   -- Transporte de mascotas
(3, 19, 'true', 0.00, true, 0),

-- Viaje 4: Valencia → Berlín
(4, 1, '1', 35.00, false, 0),       -- Maleta de pago
(4, 2, '1', 50.00, false, 0),       -- Equipaje especial / deportivo
(4, 16, '1', 30.00, false, 0),      -- Seguro de viaje estándar
(4, 20, 'true', 0.00, true, 0),     -- Asistencia PMR incluida

-- Viaje 5: Sevilla → Lisboa
(5, 1, '1', 0.00, true, 1),         -- 1 Maleta incluida
(5, 1, '1', 25.00, false, 0),        -- Adicionales económicas por cercanía
(5, 9, 'true', 0.00, true, 0),      -- Prensa digital incluida
(5, 20, 'true', 0.00, true, 0),
(5, 13, 'true', 0.00, true, 0),     -- Embarque preferente gratis en este trayecto

-- Viaje 6: Nueva York → Toronto
(6, 1, '2', 0.00, true, 2),         -- 2 Maletas incluidas (Ruta Norteamérica)
(6, 1, '1', 80.00, false, 0),       -- Adicionales caras
(6, 5, 'Asiento XL', 60.00, false, 0),
(6, 12, 'true', 20.00, false, 0),   -- Flexibilidad de cambios de fecha
(6, 6, 'true', 0.00, true, 0),      -- Sala VIP incluida

-- Viaje 7: Berlín → CDMX (Transatlántico)
(7, 1, '2', 0.00, true, 2),         -- 2 Maletas incluidas de base
(7, 1, '1', 90.00, false, 0),       -- Maleta extra
(7, 18, '1', 120.00, false, 0),     -- Upgrade a cabina superior (Premium Economy)
(7, 7, 'true', 0.00, true, 0),      -- Entretenimiento a bordo avanzado
(7, 6, 'true', 0.00, true, 0),      -- Acceso VIP
(7, 8, 'Menú Premium', 0.00, true, 0), -- Comida transatlántica de cortesía

-- Viaje 8: Madrid → Cairo
(8, 1, '2', 0.00, true, 2),
(8, 6, 'true', 0.00, true, 0),
(8, 8, 'Pensión Completa', 0.00, true, 0),
(8, 14, 'true', 80.00, false, 0),   -- Mascotas en bodega de largo alcance
(8, 10, 'true', 0.00, true, 0),     -- Auriculares de cortesía

-- Viaje 9: Madrid → Tokio (Ruta estrella de largo alcance)
(9, 1, '2', 0.00, true, 2),
(9, 1, '1', 100.00, false, 0),      -- Extra a 100€ por volumen transcontinental
(9, 5, 'Cama Business', 0.00, true, 0), -- Configuración especial de asientos
(9, 17, '1', 150.00, false, 0),     -- Seguro médico internacional integrado
(9, 19, 'true', 0.00, true, 0),
(9, 6, 'true', 0.00, true, 0),
(9, 7, 'true', 0.00, true, 0),

-- Viaje 10: Miami → Madrid
(10, 1, '1', 0.00, true, 1),        -- 1 Maleta incluida
(10, 1, '1', 75.00, false, 0),      -- Siguiente maleta 75€
(10, 8, 'Menú Americano', 15.00, false, 0),
(10, 11, 'Wifi Ilimitado', 25.00, false, 0),
(10, 13, 'true', 20.00, false, 0),

-- Viaje 11: Los Ángeles → Tokio
(11, 1, '2', 0.00, true, 2),        -- Grandes rutas incluyen 2 bultos
(11, 1, '1', 110.00, false, 0),
(11, 7, 'true', 0.00, true, 0),     -- Entretenimiento premium gratis
(11, 12, 'Flex total', 50.00, false, 0),
(11, 6, 'true', 35.00, false, 0),   -- Sala VIP opcional

-- Viaje 12: Nueva York → Londres
(12, 1, '1', 0.00, true, 1),
(12, 1, '1', 70.00, false, 0),
(12, 5, 'Asiento Ventanilla Delantera', 18.00, false, 0),
(12, 8, 'Menú Executive', 30.00, false, 0),
(12, 11, 'true', 0.00, true, 0),

-- Viaje 13: Londres → Barcelona
(13, 1, '1', 35.00, false, 0),      -- Saltos europeos cortos cobran equipaje
(13, 13, 'true', 12.00, false, 0),
(13, 19, 'true', 0.00, true, 0),
(13, 16, 'true', 15.00, false, 0),

-- Viaje 14: Londres → Los Ángeles
(14, 1, '2', 0.00, true, 2),
(14, 1, '1', 85.00, false, 0),
(14, 8, 'Menú Standard', 0.00, true, 0),
(14, 14, 'true', 90.00, false, 0),

-- Viaje 15: Galway → París
(15, 1, '1', 38.00, false, 0),
(15, 5, 'Asiento Pasillo', 8.00, false, 0),
(15, 11, 'true', 0.00, true, 0),
(15, 13, 'true', 15.00, false, 0),

-- Viaje 16: París → Tokio
(16, 1, '2', 0.00, true, 2),
(16, 1, '1', 120.00, false, 0),
(16, 6, 'true', 0.00, true, 0),     -- Hub de París incluye accesos preferenciales
(16, 8, 'Menú Alta Cocina', 40.00, false, 0),
(16, 7, 'true', 0.00, true, 0),

-- Viaje 17: París → Valencia
(17, 1, '1', 0.00, true, 1),        -- Oferta especial con maleta incluida
(17, 1, '1', 30.00, false, 0),
(17, 13, 'true', 10.00, false, 0),
(17, 19, 'true', 0.00, true, 0),

-- Viaje 18: Roma → Madrid
(18, 1, '1', 32.00, false, 0),
(18, 5, 'Asiento Estándar', 0.00, true, 0),
(18, 8, 'Snack Italiano', 7.50, false, 0),
(18, 11, 'true', 0.00, true, 0),

-- Viaje 19: Berlín → Sevilla
(19, 1, '1', 35.00, false, 0),
(19, 2, 'Equipaje Deportivo (Golf/Surf)', 45.00, false, 0),
(19, 13, 'true', 14.00, false, 0),
(19, 19, 'true', 0.00, true, 0),

-- Viaje 20: Ciudad de México → Madrid
(20, 1, '2', 0.00, true, 2),
(20, 1, '1', 95.00, false, 0),
(20, 8, 'Menú Tradicional', 0.00, true, 0),
(20, 12, 'true', 40.00, false, 0),
(20, 7, 'true', 0.00, true, 0),

-- Viaje 21: Dubái → Barcelona
(21, 1, '2', 0.00, true, 2),         -- Vuelo premium de largo alcance
(21, 1, '1', 100.00, false, 0),
(21, 6, 'true', 0.00, true, 0),      -- Salas VIP de Dubái abiertas para Horizonte Azul
(21, 5, 'Asiento Confort Espacio Extra', 45.00, false, 0),
(21, 11, 'Wifi Alta Velocidad', 0.00, true, 0);

SELECT setval('viaje_servicio_id_seq', (SELECT MAX(id) FROM viaje_servicio));

-- RESERVAS

INSERT INTO reservas
(id, localizador, usuario_id, vuelo_id, codigo_reserva_grupo, precio_vuelo_historico, total_extras_historico, "precioTotal", "fecCompra", pasajeros, estado, created_at, updated_at)
VALUES
(1, 'HA-B34B1F', 2, 1, 'b34b1f24-794e-45de-8abb-a272eb02e914'::uuid, 150.00, 45.00, 195.00, '2025-09-15 10:00:00.000', 2, 'realizada'::public."estado_reserva_enum", '2025-09-15 10:00:00.000', '2026-05-16 16:52:07.202'),
(2, 'HA-2B559E', 2, 15, '2b559eab-6011-49c8-a0c9-7a44159a0fbd'::uuid, 380.00, 0.00, 380.00, '2026-06-12 09:30:00.000', 1, 'confirmada'::public."estado_reserva_enum", '2026-06-12 09:30:00.000', '2026-05-16 16:52:07.420'),
(3, 'HA-375A77', 3, 5, '375a77d2-d721-458e-9671-000817384408'::uuid, 90.00, 35.00, 125.00, '2025-11-20 15:45:00.000', 1, 'realizada'::public."estado_reserva_enum", '2025-11-20 15:45:00.000', '2026-05-16 16:52:07.721'),
(4, 'HA-643764', 4, 10, '643764d1-3428-455c-917d-9a0796a730cf'::uuid, 220.00, 15.00, 235.00, '2026-03-05 12:00:00.000', 1, 'confirmada'::public."estado_reserva_enum", '2026-03-05 12:00:00.000', '2026-05-16 16:52:07.924'),
(5, 'HA-5ACC3F', 5, 18, '5acc3f69-737a-4265-9d1f-d42a833246cd'::uuid, 115.00, 15.00, 130.00, '2026-08-20 14:00:00.000', 1, 'confirmada'::public."estado_reserva_enum", '2026-08-20 14:00:00.000', '2026-05-16 16:52:08.141'),
(6, 'HA-EF8835', 6, 3, 'ef883561-f721-4d98-9683-20a7914f67ab'::uuid, 310.00, 45.00, 355.00, '2025-12-05 11:10:00.000', 1, 'realizada'::public."estado_reserva_enum", '2025-12-05 11:10:00.000', '2026-05-16 16:52:08.355'),
(7, 'HA-CEBA10', 7, 12, 'ceba1054-a764-48fd-b744-9023b9344ab7'::uuid, 450.00, 10.00, 460.00, '2026-10-15 20:00:00.000', 1, 'confirmada'::public."estado_reserva_enum", '2026-10-15 20:00:00.000', '2026-05-16 16:52:08.542'),
(8, 'HA-2B73D0', 8, 7, '2b73d0a4-9d6a-488f-ae11-2540bd2a726e'::uuid, 180.00, 0.00, 180.00, '2027-04-01 13:00:00.000', 1, 'confirmada'::public."estado_reserva_enum", '2027-04-01 13:00:00.000', '2026-05-16 16:52:08.705'),
(9, 'HA-6EDDC3', 2, 20, '6eddc302-ed50-4f2e-af86-28e595e1ce90'::uuid, 850.00, 120.00, 970.00, '2026-01-10 14:20:00.000', 4, 'confirmada'::public."estado_reserva_enum", '2026-01-10 14:20:00.000', '2026-01-10 14:20:00.000'),
(10, 'HA-C6AB54', 3, 11, 'c6ab545b-0625-413c-a7a9-21776d2570bb'::uuid, 145.00, 15.00, 160.00, '2025-09-25 08:30:00.000', 1, 'realizada'::public."estado_reserva_enum", '2025-09-25 08:30:00.000', '2025-09-25 08:30:00.000'),
(11, 'HA-95853B', 4, 18, '95853bdd-9113-437a-91d9-260d84f02f4a'::uuid, 110.00, 60.00, 170.00, '2026-11-12 19:45:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2026-11-12 19:45:00.000', '2026-11-12 19:45:00.000'),
(12, 'HA-214631', 5, 15, '21463125-1a9d-4774-bcee-5be76f8fe011'::uuid, 320.00, 90.00, 410.00, '2027-02-05 10:00:00.000', 3, 'confirmada'::public."estado_reserva_enum", '2027-02-05 10:00:00.000', '2027-02-05 10:00:00.000'),
(13, 'HA-23FA9E', 6, 12, '23fa9e7b-84b5-4953-afbf-873f7d8c9ed0'::uuid, 210.00, 10.00, 220.00, '2025-10-30 11:00:00.000', 1, 'realizada'::public."estado_reserva_enum", '2025-10-30 11:00:00.000', '2025-10-30 11:00:00.000'),
(14, 'HA-CF49BB', 7, 4, 'cf49bb09-aa3c-440e-b825-cdbc39ba5391'::uuid, 95.00, 30.00, 125.00, '2026-05-20 16:15:00.000', 3, 'pendiente'::public."estado_reserva_enum", '2026-05-20 16:15:00.000', '2026-05-20 16:15:00.000'),
(15, 'HA-526E03', 8, 2, '526e0360-26df-4f4a-8912-3a60f12822b5'::uuid, 75.00, 15.00, 90.00, '2027-05-01 09:00:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2027-05-01 09:00:00.000', '2027-05-01 09:00:00.000'),
(16, 'HA-7A5B00', 3, 11, '7a5b0069-e0f1-4e3d-ab63-1802130b8258'::uuid, 140.00, 15.00, 155.00, '2025-09-20 10:00:00.000', 1, 'realizada'::public."estado_reserva_enum", '2025-09-20 10:00:00.000', '2025-09-20 10:00:00.000'),
(17, 'HA-8E63B6', 4, 2, '8e63b62f-8cf1-4934-866b-2f7d21a291ad'::uuid, 85.00, 0.00, 85.00, '2025-10-05 12:00:00.000', 2, 'realizada'::public."estado_reserva_enum", '2025-10-05 12:00:00.000', '2025-10-05 12:00:00.000'),
(18, 'HA-A50858', 5, 15, 'a508589d-dcf0-493c-b981-a7d214f404ce'::uuid, 310.00, 60.00, 370.00, '2025-11-12 09:30:00.000', 3, 'realizada'::public."estado_reserva_enum", '2025-11-12 09:30:00.000', '2025-11-12 09:30:00.000'),
(19, 'HA-BAFE4A', 6, 4, 'bafe4a9b-382a-4a88-a945-37f9d452f55f'::uuid, 95.00, 15.00, 110.00, '2025-12-20 18:45:00.000', 1, 'realizada'::public."estado_reserva_enum", '2025-12-20 18:45:00.000', '2025-12-20 18:45:00.000'),
(20, 'HA-7ED773', 2, 20, '7ed7737e-c83a-415f-ae97-7f64478433b9'::uuid, 890.00, 120.00, 1010.00, '2026-01-15 14:00:00.000', 4, 'confirmada'::public."estado_reserva_enum", '2026-01-15 14:00:00.000', '2026-01-15 14:00:00.000'),
(21, 'HA-9A0108', 7, 8, '9a010827-433a-4936-a3e3-167c44edaa21'::uuid, 120.00, 10.00, 130.00, '2026-02-14 11:00:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2026-02-14 11:00:00.000', '2026-02-14 11:00:00.000'),
(22, 'HA-511821', 8, 12, '51182121-f23e-438e-8223-de9065363e61'::uuid, 450.00, 45.00, 495.00, '2026-03-30 20:00:00.000', 1, 'confirmada'::public."estado_reserva_enum", '2026-03-30 20:00:00.000', '2026-03-30 20:00:00.000'),
(23, 'HA-CC4E8B', 3, 1, 'cc4e8bc5-ff4c-4fdd-a931-0905f956a0c5'::uuid, 160.00, 15.00, 175.00, '2026-04-22 10:15:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2026-04-22 10:15:00.000', '2026-04-22 10:15:00.000'),
(24, 'HA-DAC1CB', 4, 18, 'dac1cb9e-5ee0-428c-a19d-a080d124a5b6'::uuid, 115.00, 0.00, 115.00, '2026-05-10 08:30:00.000', 1, 'confirmada'::public."estado_reserva_enum", '2026-05-10 08:30:00.000', '2026-05-10 08:30:00.000'),
(25, 'HA-EE2740', 5, 14, 'ee274085-16dc-40a3-b520-83d7955aac88'::uuid, 280.00, 30.00, 310.00, '2026-06-18 15:45:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2026-06-18 15:45:00.000', '2026-06-18 15:45:00.000'),
(26, 'HA-D48FF1', 2, 7, 'd48ff1c6-885c-4964-a747-eb058ce07270'::uuid, 190.00, 15.00, 205.00, '2026-07-05 12:00:00.000', 3, 'confirmada'::public."estado_reserva_enum", '2026-07-05 12:00:00.000', '2026-07-05 12:00:00.000'),
(27, 'HA-F27DB5', 6, 19, 'f27db532-f5c5-443f-8935-329f1d4da3df'::uuid, 210.00, 10.00, 220.00, '2026-08-12 17:20:00.000', 1, 'confirmada'::public."estado_reserva_enum", '2026-08-12 17:20:00.000', '2026-08-12 17:20:00.000'),
(28, 'HA-B4D6F1', 7, 3, 'b4d6f1e1-6763-4c13-9b10-1cc9f8fbc6c2'::uuid, 310.00, 45.00, 355.00, '2027-01-20 11:10:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2027-01-20 11:10:00.000', '2027-01-20 11:10:00.000'),
(29, 'HA-63EA6A', 8, 5, '63ea6a98-7792-462f-b5ca-4546dc27a81b'::uuid, 85.00, 15.00, 100.00, '2027-05-15 09:00:00.000', 1, 'confirmada'::public."estado_reserva_enum", '2027-05-15 09:00:00.000', '2027-05-15 09:00:00.000'),
(30, 'HA-91F4F8', 2, 10, '91f4f865-4f15-4dbc-bbf3-afef6dc4a82c'::uuid, 230.00, 15.00, 245.00, '2027-10-10 14:00:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2027-10-10 14:00:00.000', '2027-10-10 14:00:00.000'),
(31, 'HA-7FF36B', 4, 20, '7ff36b49-54fb-4305-8675-1a1560f32fbe'::uuid, 950.00, 60.00, 1010.00, '2027-12-01 10:00:00.000', 4, 'confirmada'::public."estado_reserva_enum", '2027-12-01 10:00:00.000', '2027-12-01 10:00:00.000'),
(32, 'HA-245598', 2, 15, '245598e1-8284-4bf7-b7c4-fe2f8d113ace'::uuid, 420.00, 30.00, 450.00, '2025-12-10 10:00:00.000', 2, 'realizada'::public."estado_reserva_enum", '2025-12-10 10:00:00.000', '2025-12-10 10:00:00.000'),
(33, 'HA-F5FB23', 3, 1, 'f5fb23ca-ffb0-4f6d-b87c-222816dda48b'::uuid, 180.00, 15.00, 195.00, '2025-12-15 12:00:00.000', 1, 'cancelada'::public."estado_reserva_enum", '2025-12-15 12:00:00.000', '2025-12-16 09:00:00.000'),
(34, 'HA-E19CBD', 4, 20, 'e19cbde8-8a22-4f01-948e-4556854696c1'::uuid, 950.00, 90.00, 1040.00, '2025-12-20 15:30:00.000', 4, 'realizada'::public."estado_reserva_enum", '2025-12-20 15:30:00.000', '2025-12-20 15:30:00.000'),
(35, 'HA-3069D6', 5, 5, '3069d636-9858-4788-9de6-63a6f205aceb'::uuid, 85.00, 15.00, 100.00, '2026-03-10 09:00:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2026-03-10 09:00:00.000', '2026-03-10 09:00:00.000'),
(36, 'HA-8E7C2F', 6, 12, '8e7c2f54-c837-430e-b2d4-0f94b7e1ef55'::uuid, 450.00, 0.00, 450.00, '2026-04-05 18:00:00.000', 1, 'cancelada'::public."estado_reserva_enum", '2026-04-05 18:00:00.000', '2026-04-10 11:00:00.000'),
(37, 'HA-12B174', 7, 18, '12b17428-ae5c-4313-ab1d-31e14ba6c228'::uuid, 120.00, 30.00, 150.00, '2026-05-20 11:00:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2026-05-20 11:00:00.000', '2026-05-20 11:00:00.000'),
(38, 'HA-BAA72A', 8, 10, 'baa72aa5-e80f-4998-aeeb-b516c429697d'::uuid, 250.00, 45.00, 295.00, '2026-06-15 10:00:00.000', 3, 'confirmada'::public."estado_reserva_enum", '2026-06-15 10:00:00.000', '2026-06-15 10:00:00.000'),
(39, 'HA-6D3F90', 2, 7, '6d3f9007-0f39-4379-9328-b19eeefbe9b8'::uuid, 190.00, 15.00, 205.00, '2026-07-01 09:30:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2026-07-01 09:30:00.000', '2026-07-01 09:30:00.000'),
(40, 'HA-ADC610', 3, 14, 'adc61071-355a-47dd-b9bf-547a1994b2bb'::uuid, 280.00, 30.00, 310.00, '2026-07-10 14:00:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2026-07-10 14:00:00.000', '2026-07-10 14:00:00.000'),
(41, 'HA-F66201', 4, 20, 'f66201cb-0db9-442c-b2ff-52de83823aa6'::uuid, 980.00, 120.00, 1100.00, '2026-08-05 20:00:00.000', 4, 'confirmada'::public."estado_reserva_enum", '2026-08-05 20:00:00.000', '2026-08-05 20:00:00.000'),
(42, 'HA-210F2F', 5, 3, '210f2fa7-4c40-41dd-b30f-bbcc0f66a46a'::uuid, 310.00, 0.00, 310.00, '2026-08-20 12:00:00.000', 1, 'cancelada'::public."estado_reserva_enum", '2026-08-20 12:00:00.000', '2026-08-25 08:00:00.000'),
(43, 'HA-5DBF69', 6, 15, '5dbf694c-cfc7-4a3e-8777-a06801fd7197'::uuid, 450.00, 60.00, 510.00, '2027-02-14 10:00:00.000', 2, 'confirmada'::public."estado_reserva_enum", '2027-02-14 10:00:00.000', '2027-02-14 10:00:00.000'),
(44, 'HA-B087FF', 7, 1, 'b087ffaf-c802-43b2-9e8e-ebd27a68dbf0'::uuid, 190.00, 30.00, 220.00, '2027-04-10 09:00:00.000', 2, 'pendiente'::public."estado_reserva_enum", '2027-04-10 09:00:00.000', '2027-04-10 09:00:00.000'),
(45, 'HA-1DCA3A', 8, 20, '1dca3a24-efe4-4fce-a6ab-8a1b8fbbe30e'::uuid, 1100.00, 150.00, 1250.00, '2027-07-15 15:00:00.000', 4, 'confirmada'::public."estado_reserva_enum", '2027-07-15 15:00:00.000', '2027-07-15 15:00:00.000'),
(46, 'HA-215759', 2, 11, '21575921-2a61-478d-98ea-7181e14016e4'::uuid, 200.00, 15.00, 215.00, '2027-08-20 11:00:00.000', 1, 'confirmada'::public."estado_reserva_enum", '2027-08-20 11:00:00.000', '2027-08-20 11:00:00.000'),
(47, 'HA-90733A', 3, 19, '90733a17-1ace-465d-8111-bd89c2bc8774'::uuid, 250.00, 30.00, 280.00, '2027-09-05 18:00:00.000', 2, 'pendiente'::public."estado_reserva_enum", '2027-09-05 18:00:00.000', '2027-09-05 18:00:00.000'),
(48, 'HA-CB2DE6', 8, 70, 'cb2de607-9fba-4854-bac9-070253fed29c'::uuid, 89.87, 0.00, 149.94, '2026-05-16 17:17:44.329', 1, 'confirmada'::public."estado_reserva_enum", '2026-05-16 17:17:44.329', '2026-05-16 17:17:44.329'),
(49, 'HA-CB2DE6', 8, 72, 'cb2de607-9fba-4854-bac9-070253fed29c'::uuid, 85.00, 0.00, 149.94, '2026-05-16 17:17:49.742', 1, 'confirmada'::public."estado_reserva_enum", '2026-05-16 17:17:49.742', '2026-05-16 17:17:49.742'),
(50, 'HA-MEX01', 2, 16, 'a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab'::uuid, 450.00, 30.00, 930.00, '2026-06-01 10:00:00.123', 2, 'confirmada'::public."estado_reserva_enum", '2026-06-01 10:00:00.123', '2026-06-01 10:00:00.123'),
(51, 'HA-MEX01', 2, 20, 'a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab'::uuid, 450.00, 0.00, 930.00, '2026-06-01 10:00:05.456', 2, 'confirmada'::public."estado_reserva_enum", '2026-06-01 10:00:05.456', '2026-06-01 10:00:05.456'),
(52, 'HA-PAR99', 3, 10, 'f9e8d7c6-b5a4-4321-8765-abcdef123456'::uuid, 120.00, 15.00, 255.00, '2026-07-15 09:30:00.000', 1, 'realizada'::public."estado_reserva_enum", '2026-07-15 09:30:00.000', '2026-07-15 09:30:00.000'),
(53, 'HA-PAR99', 3, 17, 'f9e8d7c6-b5a4-4321-8765-abcdef123456'::uuid, 120.00, 0.00, 255.00, '2026-07-15 09:30:08.000', 1, 'realizada'::public."estado_reserva_enum", '2026-07-15 09:30:08.000', '2026-07-15 09:30:08.000'),
(54, 'HA-LDN44', 5, 7, 'bc234567-89ab-4cde-f012-3456789abcde'::uuid, 180.00, 10.00, 370.00, '2026-08-20 14:15:22.000', 1, 'confirmada'::public."estado_reserva_enum", '2026-08-20 14:15:22.000', '2026-08-20 14:15:22.000'),
(55, 'HA-LDN44', 5, 15, 'bc234567-89ab-4cde-f012-3456789abcde'::uuid, 180.00, 0.00, 370.00, '2026-08-20 14:15:29.000', 1, 'confirmada'::public."estado_reserva_enum", '2026-08-20 14:15:29.000', '2026-08-20 14:15:29.000'),
(56, 'HA-ROM22', 7, 9, 'de345678-90ab-4def-a123-456789abcdef'::uuid, 110.00, 45.00, 265.00, '2026-10-10 18:00:00.500', 2, 'confirmada'::public."estado_reserva_enum", '2026-10-10 18:00:00.500', '2026-10-10 18:00:00.500'),
(57, 'HA-ROM22', 7, 18, 'de345678-90ab-4def-a123-456789abcdef'::uuid, 110.00, 0.00, 265.00, '2026-10-10 18:00:12.900', 2, 'confirmada'::public."estado_reserva_enum", '2026-10-10 18:00:12.900', '2026-10-10 18:00:12.900'),
(58, 'HA-D98033', 2, 96, 'd980334e-b197-477b-a08e-f3b7b1da1e99'::uuid, 820.00, 0.00, 1067.50, '2026-05-16 17:33:32.519', 1, 'pendiente'::public."estado_reserva_enum", '2026-05-16 17:33:32.519', '2026-05-16 17:33:32.519'),
(59, 'HA-D98033', 2, 97, 'd980334e-b197-477b-a08e-f3b7b1da1e99'::uuid, 790.00, 0.00, 1067.50, '2026-05-16 17:33:37.354', 1, 'pendiente'::public."estado_reserva_enum", '2026-05-16 17:33:37.354', '2026-05-16 17:33:37.354');

SELECT setval('reservas_id_seq', (SELECT MAX(id) FROM reservas));

--- RESERVA_SERVICIOS
INSERT INTO reserva_servicios
(reserva_id, servicio_id, nombre_servicio, valor_seleccionado, cantidad, precio_unitario_pagado, tipo_vuelo, created_at)
VALUES(1, 1, 'Maleta extra 23kg', '1', 1, 30.00, 'ambos'::public."tipo_vuelo_enum", '2025-09-15 10:00:00.000'),
(1, 5, 'Asiento XL', '14C', 1, 15.00, 'ambos'::public."tipo_vuelo_enum", '2025-09-15 10:00:00.000'),
(3, 6, 'Acceso Sala VIP', 'true', 1, 35.00, 'ambos'::public."tipo_vuelo_enum", '2025-11-20 15:45:00.000'),
(4, 5, 'Asiento XL', '2A', 1, 15.00, 'ambos'::public."tipo_vuelo_enum", '2026-03-05 12:00:00.000'),
(5, 8, 'Menú a bordo', 'Pasta Alfredo', 1, 15.00, 'ambos'::public."tipo_vuelo_enum", '2026-08-20 14:00:00.000'),
(6, 2, 'Equipaje deportivo', '1', 1, 45.00, 'ambos'::public."tipo_vuelo_enum", '2025-12-05 11:10:00.000'),
(7, 11, 'Check-in prioritario', 'true', 1, 10.00, 'ambos'::public."tipo_vuelo_enum", '2026-10-15 20:00:00.000'),
(10, 1, 'Maleta extra 23kg', '4', 4, 30.00, 'ambos'::public."tipo_vuelo_enum", '2026-01-10 14:20:00.000'),
(11, 5, 'Asiento XL', '1A', 1, 15.00, 'ambos'::public."tipo_vuelo_enum", '2025-09-25 08:30:00.000'),
(12, 5, 'Asiento XL', '12C, 12D', 2, 15.00, 'ambos'::public."tipo_vuelo_enum", '2026-11-12 19:45:00.000'),
(12, 10, 'Cancelación garantizada', 'true', 1, 30.00, 'ambos'::public."tipo_vuelo_enum", '2026-11-12 19:45:00.000'),
(13, 1, 'Maleta extra 23kg', '3', 3, 30.00, 'ambos'::public."tipo_vuelo_enum", '2027-02-05 10:00:00.000'),
(14, 11, 'Check-in prioritario', 'true', 1, 10.00, 'ambos'::public."tipo_vuelo_enum", '2025-10-30 11:00:00.000'),
(15, 8, 'Menú a bordo', 'Hamburguesa', 3, 10.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-20 16:15:00.000'),
(16, 1, 'Maleta extra 23kg', '1', 1, 15.00, 'ambos'::public."tipo_vuelo_enum", '2025-09-20 10:00:00.000'),
(18, 1, 'Maleta extra 23kg', '2', 2, 30.00, 'ambos'::public."tipo_vuelo_enum", '2025-11-12 09:30:00.000'),
(20, 5, 'Asiento XL', '1A, 1B, 1C, 1D', 4, 30.00, 'ambos'::public."tipo_vuelo_enum", '2026-01-15 14:00:00.000'),
(24, 8, 'Menú a bordo', 'Whisky & Steak', 1, 15.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-10 08:30:00.000'),
(31, 2, 'Equipaje deportivo', 'Katanas (Special)', 1, 60.00, 'ambos'::public."tipo_vuelo_enum", '2027-12-01 10:00:00.000'),
(32, 1, 'Maleta extra 23kg', '2', 2, 15.00, 'ambos'::public."tipo_vuelo_enum", '2025-12-10 10:00:00.000'),
(34, 1, 'Maleta extra 23kg', '3', 3, 30.00, 'ambos'::public."tipo_vuelo_enum", '2025-12-20 15:30:00.000'),
(38, 5, 'Asiento XL', '1A, 1B, 1C', 3, 15.00, 'ambos'::public."tipo_vuelo_enum", '2026-06-15 10:00:00.000'),
(45, 1, 'Maleta extra 23kg', '4', 4, 30.00, 'ambos'::public."tipo_vuelo_enum", '2027-07-15 15:00:00.000'),
(45, 6, 'Acceso Sala VIP', 'true', 1, 30.00, 'ambos'::public."tipo_vuelo_enum", '2027-07-15 15:00:00.000'),
(48, 1, 'Maleta extra 23kg', '1', 1, 25.00, 'ida'::public."tipo_vuelo_enum", '2026-05-16 17:17:44.751'),
(48, 13, 'Bus al destino (Enlace)', 'true', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:17:45.183'),
(48, 9, 'Cambio de fecha flexible', 'true', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:17:45.379'),
(48, 1, 'Maleta extra 23kg', '1', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:17:45.621'),
(48, 20, 'Puerto USB/Enchufe', 'true', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:17:45.808'),
(49, 1, 'Maleta extra 23kg', '1', 4, 25.00, 'vuelta'::public."tipo_vuelo_enum", '2026-05-16 17:17:50.144'),
(49, 13, 'Bus al destino (Enlace)', 'true', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:17:50.518'),
(49, 9, 'Cambio de fecha flexible', 'true', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:17:50.700'),
(49, 1, 'Maleta extra 23kg', '1', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:17:50.918'),
(49, 20, 'Puerto USB/Enchufe', 'true', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:17:51.095'),
(48, 1, 'Maleta extra 23kg', '1', 1, 30.00, 'ida'::public."tipo_vuelo_enum", '2026-06-01 10:00:00.123'),
(48, 11, 'Check-in prioritario', 'true', 1, 0.00, 'ida'::public."tipo_vuelo_enum", '2026-06-01 10:00:00.123'),
(49, 8, 'Menú a bordo', 'Menú Mexicano', 2, 0.00, 'vuelta'::public."tipo_vuelo_enum", '2026-06-01 10:00:05.456'),
(50, 5, 'Asiento XL', '12A', 1, 15.00, 'ida'::public."tipo_vuelo_enum", '2026-07-15 09:30:00.000'),
(51, 1, 'Maleta extra 23kg', '1', 1, 0.00, 'vuelta'::public."tipo_vuelo_enum", '2026-07-15 09:30:08.000'),
(52, 11, 'Check-in prioritario', 'true', 1, 10.00, 'ida'::public."tipo_vuelo_enum", '2026-08-20 14:15:22.000'),
(53, 5, 'Asiento Estándar', '22F', 1, 0.00, 'vuelta'::public."tipo_vuelo_enum", '2026-08-20 14:15:29.000'),
(54, 1, 'Maleta extra 23kg', '1', 1, 32.00, 'ida'::public."tipo_vuelo_enum", '2026-10-10 18:00:00.500'),
(54, 8, 'Snack Italiano', 'Bruschetta Pack', 2, 6.50, 'ida'::public."tipo_vuelo_enum", '2026-10-10 18:00:00.500'),
(55, 11, 'Check-in prioritario', 'true', 1, 0.00, 'vuelta'::public."tipo_vuelo_enum", '2026-10-10 18:00:12.900'),
(58, 1, 'Maleta extra 23kg', '1', 3, 110.00, 'ida'::public."tipo_vuelo_enum", '2026-05-16 17:33:32.889'),
(58, 12, 'Fast Track (Control rápido)', 'Flex total', 1, 50.00, 'ida'::public."tipo_vuelo_enum", '2026-05-16 17:33:33.061'),
(58, 1, 'Maleta extra 23kg', '2', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:33:33.386'),
(58, 7, 'Pack descanso (Manta/Antifaz)', 'true', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:33:33.578'),
(59, 1, 'Maleta extra 23kg', '1', 1, 110.00, 'vuelta'::public."tipo_vuelo_enum", '2026-05-16 17:33:37.666'),
(59, 6, 'Acceso Sala VIP', '1', 1, 35.00, 'vuelta'::public."tipo_vuelo_enum", '2026-05-16 17:33:37.815'),
(59, 1, 'Maleta extra 23kg', '2', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:33:38.114'),
(59, 7, 'Pack descanso (Manta/Antifaz)', 'true', 1, 0.00, 'ambos'::public."tipo_vuelo_enum", '2026-05-16 17:33:38.280');

SELECT setval('reserva_servicios_id_seq', (SELECT MAX(id) FROM reserva_servicios));

--- PASAJEROS

INSERT INTO pasajeros
(reserva_id, nombre, apellidos, "tipoDocumento", "numDocumento", "fecCaducidadDocumento", "fecNacimiento", "esAdulto", created_at, updated_at)
VALUES(1, 'Monica', 'Geller', 'DNI'::public."tipo_documento_enum", '12345678M', NULL, NULL, true, '2025-09-15 10:00:00.000', '2025-09-15 10:00:00.000'),
(2, 'Walter', 'White', 'DNI'::public."tipo_documento_enum", '55544433W', NULL, NULL, true, '2026-06-12 09:30:00.000', '2026-06-12 09:30:00.000'),
(3, 'Logan', 'Roy', 'Pasaporte'::public."tipo_documento_enum", 'PAS999888', NULL, NULL, true, '2025-11-20 15:45:00.000', '2025-11-20 15:45:00.000'),
(4, 'Eleven', 'Hopper', 'DNI'::public."tipo_documento_enum", '01101101E', NULL, NULL, false, '2026-03-05 12:00:00.000', '2026-03-05 12:00:00.000'),
(5, 'Dwight', 'Schrute', 'DNI'::public."tipo_documento_enum", '44455566D', NULL, NULL, true, '2026-08-20 14:00:00.000', '2026-08-20 14:00:00.000'),
(6, 'Daenerys', 'Targaryen', 'Pasaporte'::public."tipo_documento_enum", 'PAS000111', NULL, NULL, true, '2025-12-05 11:10:00.000', '2025-12-05 11:10:00.000'),
(7, 'Kim', 'Wexler', 'DNI'::public."tipo_documento_enum", '77788899K', NULL, NULL, true, '2026-10-15 20:00:00.000', '2026-10-15 20:00:00.000'),
(8, 'Roy', 'Kent', 'DNI'::public."tipo_documento_enum", '99911122R', NULL, NULL, true, '2027-04-01 13:00:00.000', '2027-04-01 13:00:00.000'),
(10, 'Billy', 'Butcher', 'DNI'::public."tipo_documento_enum", '99887766B', NULL, NULL, true, '2026-01-10 14:20:00.000', '2026-01-10 14:20:00.000'),
(10, 'Annie', 'January', 'DNI'::public."tipo_documento_enum", '55667788S', NULL, NULL, true, '2026-01-10 14:20:00.000', '2026-01-10 14:20:00.000'),
(10, 'Frenchie', 'Serge', 'Pasaporte'::public."tipo_documento_enum", 'PAS445566', NULL, NULL, true, '2026-01-10 14:20:00.000', '2026-01-10 14:20:00.000'),
(11, 'Jack', 'Shephard', 'DNI'::public."tipo_documento_enum", '77889900L', NULL, NULL, true, '2025-09-25 08:30:00.000', '2025-09-25 08:30:00.000'),
(12, 'Ted', 'Mosby', 'DNI'::public."tipo_documento_enum", '10203040M', NULL, NULL, true, '2026-11-12 19:45:00.000', '2026-11-12 19:45:00.000'),
(12, 'Robin', 'Scherbatsky', 'Pasaporte'::public."tipo_documento_enum", 'PAS102030', NULL, NULL, true, '2026-11-12 19:45:00.000', '2026-11-12 19:45:00.000'),
(13, 'Phil', 'Dunphy', 'DNI'::public."tipo_documento_enum", '44556677D', NULL, NULL, true, '2027-02-05 10:00:00.000', '2027-02-05 10:00:00.000'),
(13, 'Claire', 'Dunphy', 'DNI'::public."tipo_documento_enum", '88990011D', NULL, NULL, true, '2027-02-05 10:00:00.000', '2027-02-05 10:00:00.000'),
(13, 'Luke', 'Dunphy', 'DNI'::public."tipo_documento_enum", '22334455L', NULL, NULL, false, '2027-02-05 10:00:00.000', '2027-02-05 10:00:00.000'),
(14, 'Sydney', 'Adamu', 'DNI'::public."tipo_documento_enum", '12312312A', NULL, NULL, true, '2025-10-30 11:00:00.000', '2025-10-30 11:00:00.000'),
(15, 'Jake', 'Peralta', 'DNI'::public."tipo_documento_enum", '99881122P', NULL, NULL, true, '2026-05-20 16:15:00.000', '2026-05-20 16:15:00.000'),
(15, 'Amy', 'Santiago', 'DNI'::public."tipo_documento_enum", '33445566S', NULL, NULL, true, '2026-05-20 16:15:00.000', '2026-05-20 16:15:00.000'),
(16, 'Desmond', 'Hume', 'DNI'::public."tipo_documento_enum", '00400815L', NULL, NULL, true, '2025-09-20 10:00:00.000', '2025-09-20 10:00:00.000'),
(17, 'Marshall', 'Eriksen', 'DNI'::public."tipo_documento_enum", '11223344M', NULL, NULL, true, '2025-10-05 12:00:00.000', '2025-10-05 12:00:00.000'),
(17, 'Lily', 'Aldrin', 'DNI'::public."tipo_documento_enum", '55667788L', NULL, NULL, true, '2025-10-05 12:00:00.000', '2025-10-05 12:00:00.000'),
(18, 'Siobhan', 'Roy', 'NIE'::public."tipo_documento_enum", 'X8887776S', NULL, NULL, true, '2025-11-12 09:30:00.000', '2025-11-12 09:30:00.000'),
(20, 'William', 'Butcher', 'DNI'::public."tipo_documento_enum", '99001122B', NULL, NULL, true, '2026-01-15 14:00:00.000', '2026-01-15 14:00:00.000'),
(20, 'Hugh', 'Campbell', 'DNI'::public."tipo_documento_enum", '33445566C', NULL, NULL, true, '2026-01-15 14:00:00.000', '2026-01-15 14:00:00.000'),
(20, 'Serge', 'Frenchie', 'Pasaporte'::public."tipo_documento_enum", 'PAS778899', NULL, NULL, true, '2026-01-15 14:00:00.000', '2026-01-15 14:00:00.000'),
(24, 'Thomas', 'Shelby', 'DNI'::public."tipo_documento_enum", '19191919S', NULL, NULL, true, '2026-05-10 08:30:00.000', '2026-05-10 08:30:00.000'),
(31, 'John', 'Blackthorne', 'Pasaporte'::public."tipo_documento_enum", 'PAS160001', NULL, NULL, true, '2027-12-01 10:00:00.000', '2027-12-01 10:00:00.000'),
(31, 'Toda', 'Mariko', 'Pasaporte'::public."tipo_documento_enum", 'PAS160002', NULL, NULL, true, '2027-12-01 10:00:00.000', '2027-12-01 10:00:00.000'),
(15, 'Charles', 'Boyle', 'DNI'::public."tipo_documento_enum", '77665544B', NULL, NULL, false, '2026-05-20 16:15:00.000', '2026-05-16 17:25:22.397'),
(18, 'Kendall', 'Roy', 'NIE'::public."tipo_documento_enum", 'X8887776K', NULL, NULL, false, '2025-11-12 09:30:00.000', '2026-05-16 17:25:22.609'),
(18, 'Roman', 'Roy', 'NIE'::public."tipo_documento_enum", 'X8887776R', NULL, NULL, false, '2025-11-12 09:30:00.000', '2026-05-16 17:25:22.820'),
(20, 'Kimiko', 'Miyashiro', 'Pasaporte'::public."tipo_documento_enum", 'PAS112233', NULL, NULL, false, '2026-01-15 14:00:00.000', '2026-05-16 17:25:23.014'),
(1, 'Chandler', 'Bing', 'DNI'::public."tipo_documento_enum", '12345678C', NULL, NULL, true, '2025-09-15 10:00:00.000', '2026-05-16 17:39:39.173'),
(1, 'Monica', 'Geller', 'DNI'::public."tipo_documento_enum", '12345678M', NULL, NULL, true, '2025-09-15 10:00:00.000', '2026-05-16 17:39:39.354'),
(2, 'Walter', 'White', 'DNI'::public."tipo_documento_enum", '55544433W', NULL, NULL, true, '2026-06-12 09:30:00.000', '2026-05-16 17:39:39.553'),
(3, 'Logan', 'Roy', 'Pasaporte'::public."tipo_documento_enum", 'PAS999888', NULL, NULL, true, '2025-11-20 15:45:00.000', '2026-05-16 17:39:39.755'),
(4, 'Eleven', 'Hopper', 'DNI'::public."tipo_documento_enum", '01101101E', NULL, NULL, false, '2026-03-05 12:00:00.000', '2026-05-16 17:39:40.022'),
(5, 'Dwight', 'Schrute', 'DNI'::public."tipo_documento_enum", '44455566D', NULL, NULL, true, '2026-08-20 14:00:00.000', '2026-05-16 17:39:40.232'),
(6, 'Daenerys', 'Targaryen', 'Pasaporte'::public."tipo_documento_enum", 'PAS000111', NULL, NULL, true, '2025-12-05 11:10:00.000', '2026-05-16 17:39:40.446'),
(7, 'Kim', 'Wexler', 'DNI'::public."tipo_documento_enum", '77788899K', NULL, NULL, true, '2026-10-15 20:00:00.000', '2026-05-16 17:39:40.626'),
(8, 'Roy', 'Kent', 'DNI'::public."tipo_documento_enum", '99911122R', NULL, NULL, true, '2027-04-01 13:00:00.000', '2026-05-16 17:39:40.847'),
(1, 'Chandler', 'Bing', 'DNI'::public."tipo_documento_enum", '12345678C', NULL, NULL, true, '2025-09-15 10:00:00.000', '2026-05-16 17:39:41.038'),
(31, 'Kashigi', 'Yabushige', 'Pasaporte'::public."tipo_documento_enum", 'PAS160004', NULL, NULL, true, '2027-12-01 10:00:00.000', '2027-12-01 10:00:00.000'),
(32, 'Phoebe', 'Buffay', 'DNI'::public."tipo_documento_enum", '99887766P', NULL, NULL, true, '2025-12-10 10:00:00.000', '2025-12-10 10:00:00.000'),
(32, 'Mike', 'Hannigan', 'DNI'::public."tipo_documento_enum", '11223344M', NULL, NULL, true, '2025-12-10 10:00:00.000', '2025-12-10 10:00:00.000'),
(33, 'Meredith', 'Grey', 'Pasaporte'::public."tipo_documento_enum", 'PAS445566', NULL, NULL, true, '2025-12-15 12:00:00.000', '2025-12-15 12:00:00.000'),
(34, 'Sheldon', 'Cooper', 'DNI'::public."tipo_documento_enum", '00112233S', NULL, NULL, true, '2025-12-20 15:30:00.000', '2025-12-20 15:30:00.000'),
(34, 'Leonard', 'Hofstadter', 'DNI'::public."tipo_documento_enum", '00112233L', NULL, NULL, true, '2025-12-20 15:30:00.000', '2025-12-20 15:30:00.000'),
(34, 'Penny', 'Hofstadter', 'DNI'::public."tipo_documento_enum", '00112233P', NULL, NULL, true, '2025-12-20 15:30:00.000', '2025-12-20 15:30:00.000'),
(34, 'Howard', 'Wolowitz', 'DNI'::public."tipo_documento_enum", '00112233H', NULL, NULL, true, '2025-12-20 15:30:00.000', '2025-12-20 15:30:00.000'),
(38, 'Din', 'Djarin', 'Pasaporte'::public."tipo_documento_enum", 'PAS556677', NULL, NULL, true, '2026-06-15 10:00:00.000', '2026-06-15 10:00:00.000'),
(38, 'Grogu', 'Djarin', 'DNI'::public."tipo_documento_enum", '00000000G', NULL, NULL, false, '2026-06-15 10:00:00.000', '2026-06-15 10:00:00.000'),
(38, 'Bo-Katan', 'Kryze', 'Pasaporte'::public."tipo_documento_enum", 'PAS889900', NULL, NULL, true, '2026-06-15 10:00:00.000', '2026-06-15 10:00:00.000'),
(45, 'Rhaenyra', 'Targaryen', 'Pasaporte'::public."tipo_documento_enum", 'PAS112244', NULL, NULL, true, '2027-07-15 15:00:00.000', '2027-07-15 15:00:00.000'),
(45, 'Daemon', 'Targaryen', 'Pasaporte'::public."tipo_documento_enum", 'PAS223355', NULL, NULL, true, '2027-07-15 15:00:00.000', '2027-07-15 15:00:00.000'),
(45, 'Jacaerys', 'Velaryon', 'Pasaporte'::public."tipo_documento_enum", 'PAS334466', NULL, NULL, true, '2027-07-15 15:00:00.000', '2027-07-15 15:00:00.000'),
(45, 'Lucerys', 'Velaryon', 'Pasaporte'::public."tipo_documento_enum", 'PAS445577', NULL, NULL, false, '2027-07-15 15:00:00.000', '2027-07-15 15:00:00.000'),
(48, 'Jaume', 'Vallés Terol', 'DNI'::public."tipo_documento_enum", '5667623R', '2027-08-25', '2007-06-06', true, '2026-05-16 17:17:44.540', '2026-05-16 17:17:44.540'),
(49, 'Jaume', 'Vallés Terol', 'DNI'::public."tipo_documento_enum", '5667623R', '2027-08-25', '2007-06-06', true, '2026-05-16 17:17:49.940', '2026-05-16 17:17:49.940'),
(10, 'Hughie', 'Campbell', 'DNI'::public."tipo_documento_enum", '11223344C', NULL, NULL, false, '2026-01-10 14:20:00.000', '2026-05-16 17:25:22.186'),
(31, 'Yoshii', 'Toranaga', 'Pasaporte'::public."tipo_documento_enum", 'PAS160003', NULL, NULL, false, '2027-12-01 10:00:00.000', '2026-05-16 17:25:23.186'),
(48, 'Homelander', 'John', 'DNI'::public."tipo_documento_enum", '00000001S', NULL, NULL, true, '2026-06-01 10:00:00.123', '2026-06-01 10:00:00.123'),
(48, 'Starlight', 'Annie', 'DNI'::public."tipo_documento_enum", '00000002S', NULL, NULL, true, '2026-06-01 10:00:00.123', '2026-06-01 10:00:00.123'),
(49, 'Homelander', 'John', 'DNI'::public."tipo_documento_enum", '00000001S', NULL, NULL, true, '2026-06-01 10:00:05.456', '2026-06-01 10:00:05.456'),
(49, 'Starlight', 'Annie', 'DNI'::public."tipo_documento_enum", '00000002S', NULL, NULL, true, '2026-06-01 10:00:05.456', '2026-06-01 10:00:05.456'),
(50, 'Roman', 'Roy', 'Pasaporte'::public."tipo_documento_enum", 'PAS777666', NULL, NULL, true, '2026-07-15 09:30:00.000', '2026-07-15 09:30:00.000'),
(51, 'Roman', 'Roy', 'Pasaporte'::public."tipo_documento_enum", 'PAS777666', NULL, NULL, true, '2026-07-15 09:30:08.000', '2026-07-15 09:30:08.000'),
(54, 'Barney', 'Stinson', 'DNI'::public."tipo_documento_enum", '88888888L', NULL, NULL, true, '2026-10-10 18:00:00.500', '2026-10-10 18:00:00.500'),
(54, 'Robin', 'Scherbatsky', 'Pasaporte'::public."tipo_documento_enum", 'PASCAN001', NULL, NULL, true, '2026-10-10 18:00:00.500', '2026-10-10 18:00:00.500'),
(55, 'Barney', 'Stinson', 'DNI'::public."tipo_documento_enum", '88888888L', NULL, NULL, true, '2026-10-10 18:00:12.900', '2026-10-10 18:00:12.900'),
(55, 'Robin', 'Scherbatsky', 'Pasaporte'::public."tipo_documento_enum", 'PASCAN001', NULL, NULL, true, '2026-10-10 18:00:12.900', '2026-10-10 18:00:12.900'),
(58, 'Marta', 'Vallés Terol', 'DNI'::public."tipo_documento_enum", '3454656F', '2032-03-31', '2004-03-12', true, '2026-05-16 17:33:32.709', '2026-05-16 17:33:32.709'),
(59, 'Marta', 'Vallés Terol', 'DNI'::public."tipo_documento_enum", '3454656F', '2032-03-31', '2004-03-12', true, '2026-05-16 17:33:37.502', '2026-05-16 17:33:37.502');

SELECT setval('pasajeros_id_seq', (SELECT MAX(id) FROM pasajeros));



--- WHISLIST
INSERT INTO wishlist (usuario_id, viaje_id) VALUES
(2, 1),
(2, 20),
(2, 15),
(2, 5),
(3, 11),
(3, 18),
(3, 19),
(3, 3),
(3, 14),
(4, 10),
(4, 17),
(4, 2),
(4, 7),
(5, 4),
(5, 6),
(5, 13),
(5, 1),
(5, 20),
(6, 15),
(6, 12),
(6, 9),
(6, 18),
(7, 8),
(7, 16),
(7, 5),
(7, 11),
(7, 14),
(8, 2),
(8, 6),
(8, 17),
(8, 19),
(8, 3);

-- Actualizamos las plazas disponibles de cada vuelo

UPDATE vuelos v
SET "plazasDisponibles" = "plazasTotales" - (
    SELECT COALESCE(SUM(r.pasajeros), 0)
    FROM reservas r
    WHERE r.vuelo_id = v.id
    AND r.estado != 'cancelada'
);