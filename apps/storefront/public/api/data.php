<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$db_file = __DIR__ . '/../db.json';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    // Validation basique JSON
    if (json_decode($input) !== null) {
        file_put_contents($db_file, $input);
        echo json_encode(["ok" => true]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON payload"]);
    }
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($db_file)) {
        echo file_get_contents($db_file);
    } else {
        echo json_encode(new stdClass());
    }
    exit();
}
