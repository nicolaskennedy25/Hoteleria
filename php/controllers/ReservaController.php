<?php
// ==========================================
//  CONTROLLER — ReservaController
//  Intermediario entre API y Model
// ==========================================
require_once __DIR__ . '/../models/ReservaModel.php';

class ReservaController {
    private ReservaModel $model;

    public function __construct() {
        $this->model = new ReservaModel();
    }

    // Listar todas las reservas activas
    public function index(): array {
        return $this->model->getAll();
    }

    // Ver una reserva
    public function show(int $id): array {
        $reserva = $this->model->getById($id);
        if (!$reserva) throw new Exception('Reserva no encontrada', 404);
        return $reserva;
    }

    // Crear reserva con validaciones
    public function store(array $datos): array {
        $this->validar($datos);
        $noches = max(1, (int)((strtotime($datos['fecha_salida']) - strtotime($datos['fecha_entrada'])) / 86400));
        $precio = $this->model->calcularPrecio($datos['tipo_habitacion'], $datos['fecha_entrada'], $datos['fecha_salida']);
        $datos['noches']       = $noches;
        $datos['precio_total'] = $precio;
        $id = $this->model->crear($datos);
        $this->enviarConfirmacion($datos['email'], $datos['nombre'], $id, $precio, $noches);
        return ['id' => $id, 'precio_total' => $precio, 'noches' => $noches];
    }

    // Cancelar reserva
    public function destroy(int $id): bool {
        $reserva = $this->model->getById($id);
        if (!$reserva) throw new Exception('Reserva no encontrada', 404);
        return $this->model->cancelar($id);
    }

    // Habitaciones disponibles en fechas dadas
    public function disponibles(string $entrada, string $salida): array {
        if (!$entrada || !$salida) throw new Exception('Fechas requeridas', 400);
        return $this->model->getHabitacionesDisponibles($entrada, $salida);
    }

    // Calcular precio sin crear reserva
    public function precio(string $tipo, string $entrada, string $salida): float {
        return $this->model->calcularPrecio($tipo, $entrada, $salida);
    }

    // ── VALIDACIONES ─────────────────────
    private function validar(array $datos): void {
        $requeridos = ['nombre','email','fecha_entrada','fecha_salida','tipo_habitacion','metodo_pago'];
        foreach ($requeridos as $campo) {
            if (empty($datos[$campo])) throw new Exception("Campo requerido: $campo", 400);
        }
        if (!filter_var($datos['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Email inválido', 400);
        }
        if (strtotime($datos['fecha_salida']) <= strtotime($datos['fecha_entrada'])) {
            throw new Exception('La fecha de salida debe ser posterior a la de entrada', 400);
        }
        if (strtotime($datos['fecha_entrada']) < strtotime('today')) {
            throw new Exception('La fecha de entrada no puede ser en el pasado', 400);
        }
    }

    // ── ENVÍO DE EMAIL ────────────────────
    // Requiere PHPMailer: composer require phpmailer/phpmailer
    private function enviarConfirmacion(string $email, string $nombre, int $id, float $precio, int $noches): void {
        // Simulación — integrar PHPMailer para producción
        error_log("📧 Confirmación reserva #{$id} enviada a {$email} · \${$precio} · {$noches} noches");

        /*
        // EJEMPLO con PHPMailer:
        use PHPMailer\PHPMailer\PHPMailer;
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'reservas@hotelplaza.com';
        $mail->Password   = 'tu_app_password';
        $mail->Port       = 587;
        $mail->setFrom('reservas@hotelplaza.com', 'HotelPlaza');
        $mail->addAddress($email, $nombre);
        $mail->Subject    = "✅ Reserva #{$id} confirmada — HotelPlaza";
        $mail->isHTML(true);
        $mail->Body       = "<h2>¡Hola {$nombre}!</h2><p>Tu reserva #{$id} ha sido confirmada.</p>
                             <p>Total: $" . number_format($precio,0,',','.') . " COP · {$noches} noche(s).</p>";
        $mail->send();
        */
    }
}
