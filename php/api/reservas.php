<?php
// ==========================================
//  API — Reservas (REST)
//  Endpoints:
//    GET    /api/reservas.php              → listar
//    POST   /api/reservas.php              → crear
//    DELETE /api/reservas.php?id=X        → cancelar
//    GET    /api/reservas.php?action=precio → calcular precio
//    GET    /api/reservas.php?action=disponibles → habitaciones libres
// ==========================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../models/ReservaModel.php';

$model  = new ReservaModel();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

try {

    // CALCULAR PRECIO
    if ($method === 'GET' && $action === 'precio') {
        $tipo    = $_GET['tipo']    ?? '';
        $entrada = $_GET['entrada'] ?? '';
        $salida  = $_GET['salida']  ?? '';
        if (!$tipo || !$entrada || !$salida) throw new Exception('Faltan parámetros', 400);
        $precio = $model->calcularPrecio($tipo, $entrada, $salida);
        echo json_encode(['precio' => $precio]);
        exit;
    }

    // HABITACIONES DISPONIBLES
    if ($method === 'GET' && $action === 'disponibles') {
        $entrada = $_GET['entrada'] ?? '';
        $salida  = $_GET['salida']  ?? '';
        if (!$entrada || !$salida) throw new Exception('Faltan fechas', 400);
        $habitaciones = $model->getHabitacionesDisponibles($entrada, $salida);
        echo json_encode(['habitaciones' => $habitaciones]);
        exit;
    }

    // LISTAR RESERVAS
    if ($method === 'GET') {
        $reservas = $model->getAll();
        echo json_encode(['reservas' => $reservas]);
        exit;
    }

    // CREAR RESERVA
    if ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);
        $requeridos = ['nombre','email','fecha_entrada','fecha_salida','tipo_habitacion','metodo_pago'];
        foreach ($requeridos as $campo) {
            if (empty($body[$campo])) throw new Exception("Campo requerido: $campo", 400);
        }
        if (!filter_var($body['email'], FILTER_VALIDATE_EMAIL)) throw new Exception('Email inválido', 400);
        if (strtotime($body['fecha_salida']) <= strtotime($body['fecha_entrada'])) {
            throw new Exception('La fecha de salida debe ser posterior a la de entrada', 400);
        }
        $noches = max(1, (int)((strtotime($body['fecha_salida']) - strtotime($body['fecha_entrada'])) / 86400));
        $precio = $model->calcularPrecio($body['tipo_habitacion'], $body['fecha_entrada'], $body['fecha_salida']);
        $body['noches']       = $noches;
        $body['precio_total'] = $precio;
        $id = $model->crear($body);
        // TODO: enviar email de confirmación aquí (PHPMailer u otro)
        echo json_encode(['ok' => true, 'id' => $id, 'precio_total' => $precio, 'noches' => $noches]);
        exit;
    }

    // CANCELAR RESERVA
    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) throw new Exception('ID requerido', 400);
        $ok = $model->cancelar($id);
        echo json_encode(['ok' => $ok]);
        exit;
    }

    throw new Exception('Método no permitido', 405);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode(['error' => $e->getMessage()]);
}
