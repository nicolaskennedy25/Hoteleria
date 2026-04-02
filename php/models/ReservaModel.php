<?php
require_once __DIR__ . '/../config/Database.php';

class ReservaModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // Obtener todas las reservas activas
    public function getAll(): array {
        $stmt = $this->db->query("SELECT * FROM reservas WHERE estado != 'cancelada' ORDER BY fecha_entrada ASC");
        return $stmt->fetchAll();
    }

    // Obtener reserva por ID
    public function getById(int $id): array|false {
        $stmt = $this->db->prepare("SELECT * FROM reservas WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    // Crear reserva
    public function crear(array $datos): int {
        $sql = "INSERT INTO reservas 
                (nombre_huesped, email, fecha_entrada, fecha_salida, tipo_habitacion, metodo_pago, precio_total, noches, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmada')";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $datos['nombre'],
            $datos['email'],
            $datos['fecha_entrada'],
            $datos['fecha_salida'],
            $datos['tipo_habitacion'],
            $datos['metodo_pago'],
            $datos['precio_total'],
            $datos['noches'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    // Cancelar reserva
    public function cancelar(int $id): bool {
        $stmt = $this->db->prepare("UPDATE reservas SET estado = 'cancelada' WHERE id = ?");
        return $stmt->execute([$id]);
    }

    // Habitaciones disponibles
    public function getHabitacionesDisponibles(string $entrada, string $salida): array {
        $sql = "SELECT h.* FROM habitaciones h
                WHERE h.disponible = 1
                AND h.id NOT IN (
                    SELECT habitacion_id FROM reservas
                    WHERE estado = 'confirmada'
                    AND fecha_entrada < ? AND fecha_salida > ?
                )";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$salida, $entrada]);
        return $stmt->fetchAll();
    }

    // Calcular precio con temporada
    public function calcularPrecio(string $tipo, string $entrada, string $salida): float {
        $precios = [
            'sencilla' => 120000,
            'doble'    => 180000,
            'suite'    => 350000,
            'familiar' => 280000,
        ];
        $precioBase = $precios[$tipo] ?? 150000;
        $noches = max(1, (int)((strtotime($salida) - strtotime($entrada)) / 86400));
        $mes = (int)date('n', strtotime($entrada));
        if (in_array($mes, [12, 1, 6, 7])) $factor = 1.4;  // Temporada alta
        elseif (in_array($mes, [3, 4, 8, 9])) $factor = 1.1; // Temporada media
        else $factor = 0.85;                                   // Temporada baja
        return round($precioBase * $factor * $noches);
    }
}
