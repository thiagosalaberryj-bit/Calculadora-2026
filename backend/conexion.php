<?php
// conexion simple con mysqli
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'calculadora_2026';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'error de conexion']);
    exit;
}

$conn->set_charset('utf8mb4');
