<?php
header('Content-Type: application/json');
require_once __DIR__ . '/conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'metodo no permitido']);
    exit;
}

$sql = 'SELECT id, operando1, operando2, operador, resultado FROM operaciones ORDER BY id DESC LIMIT 5';
$res = $conn->query($sql);

$items = [];
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $items[] = $row;
    }
}

echo json_encode(['ok' => true, 'data' => $items]);

$conn->close();
