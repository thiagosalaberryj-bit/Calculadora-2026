<?php


header('Content-Type: application/json');
require_once __DIR__ . '/conexion.php';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'metodo no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$operando1 = isset($input['operando1']) ? (float)$input['operando1'] : null;
$operando2 = isset($input['operando2']) ? (float)$input['operando2'] : null;
$operador  = isset($input['operador']) ? trim($input['operador']) : null;
$resultado = isset($input['resultado']) ? (float)$input['resultado'] : null;

if ($operando1 === null || $operando2 === null || $resultado === null || !in_array($operador, ['+', '-', '*', '/'], true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'datos invalidos']);
    exit;
}

$sql = 'INSERT INTO operaciones (operando1, operando2, operador, resultado) VALUES (?, ?, ?, ?)';
$stmt = $conn->prepare($sql);
$stmt->bind_param('ddsd', $operando1, $operando2, $operador, $resultado);

if ($stmt->execute()) {
    echo json_encode(['ok' => true, 'id' => $conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'no se pudo guardar']);
}

$stmt->close();
$conn->close();
