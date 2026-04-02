-- ==========================================
--  HOTEL PLAZA — Schema SQL
--  Base de datos: hotel_plaza
-- ==========================================

CREATE DATABASE IF NOT EXISTS hotel_plaza
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hotel_plaza;

-- ── HABITACIONES ──────────────────────────
CREATE TABLE IF NOT EXISTS habitaciones (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  tipo        ENUM('sencilla','doble','suite','familiar') NOT NULL,
  precio_base DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  disponible  TINYINT(1) DEFAULT 1,
  creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO habitaciones (nombre, tipo, precio_base, descripcion, disponible) VALUES
('Sencilla Estándar',  'sencilla', 120000, 'Cama doble, baño privado, A/C, TV',                  1),
('Sencilla Vista',     'sencilla', 140000, 'Cama doble, vista al jardín, balcón',                 1),
('Doble Estándar',     'doble',    180000, '2 camas, baño privado, minibar, A/C',                 1),
('Doble Superior',     'doble',    220000, '2 camas queen, jacuzzi, vista piscina',               1),
('Suite Junior',       'suite',    350000, 'Sala independiente, cama king, bañera',               1),
('Suite Master',       'suite',    520000, 'Suite de lujo, terraza privada, mayordomo',           0),
('Familiar Estándar',  'familiar', 280000, '3 camas, sala, cocina equipada, A/C',                 1),
('Familiar Amplia',    'familiar', 320000, '4 camas, 2 baños, sala y comedor',                    1);

-- ── RESERVAS ──────────────────────────────
CREATE TABLE IF NOT EXISTS reservas (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nombre_huesped   VARCHAR(150) NOT NULL,
  email            VARCHAR(150) NOT NULL,
  fecha_entrada    DATE NOT NULL,
  fecha_salida     DATE NOT NULL,
  tipo_habitacion  ENUM('sencilla','doble','suite','familiar') NOT NULL,
  habitacion_id    INT,
  metodo_pago      ENUM('tarjeta','nequi','daviplata','efectivo','transferencia') NOT NULL,
  precio_total     DECIMAL(12,2) NOT NULL,
  noches           INT NOT NULL,
  estado           ENUM('confirmada','cancelada','completada') DEFAULT 'confirmada',
  creado_en        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id) ON DELETE SET NULL,
  CONSTRAINT check_fechas CHECK (fecha_salida > fecha_entrada)
);

-- ── SERVICIOS ADICIONALES ─────────────────
CREATE TABLE IF NOT EXISTS servicios_reserva (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  reserva_id  INT NOT NULL,
  servicio    ENUM('desayuno','transporte','piscina_vip','spa','parqueadero') NOT NULL,
  costo       DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE
);

-- ── USUARIOS (recepcionistas/admin) ───────
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  rol        ENUM('admin','recepcionista') DEFAULT 'recepcionista',
  activo     TINYINT(1) DEFAULT 1,
  creado_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@hotelplaza.com', '$2y$10$placeholder_hash_admin', 'admin');

-- ── VISTA: RESERVAS ACTIVAS ───────────────
CREATE OR REPLACE VIEW v_reservas_activas AS
SELECT
  r.id,
  r.nombre_huesped,
  r.email,
  r.fecha_entrada,
  r.fecha_salida,
  r.tipo_habitacion,
  h.nombre AS nombre_habitacion,
  r.metodo_pago,
  r.precio_total,
  r.noches,
  r.estado,
  r.creado_en
FROM reservas r
LEFT JOIN habitaciones h ON r.habitacion_id = h.id
WHERE r.estado = 'confirmada'
ORDER BY r.fecha_entrada ASC;

-- ── ÍNDICES ───────────────────────────────
CREATE INDEX idx_reservas_email   ON reservas(email);
CREATE INDEX idx_reservas_fechas  ON reservas(fecha_entrada, fecha_salida);
CREATE INDEX idx_reservas_estado  ON reservas(estado);
CREATE INDEX idx_hab_tipo         ON habitaciones(tipo);
CREATE INDEX idx_hab_disponible   ON habitaciones(disponible);
