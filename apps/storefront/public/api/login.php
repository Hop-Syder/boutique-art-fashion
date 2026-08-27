<?php
/**
 * POST /api/login.php {email, password} → {token}
 * Vérifie les identifiants admin côté serveur et émet un token signé,
 * utilisé ensuite comme Authorization: Bearer <token> par upload.php.
 */
require_once __DIR__ . '/_auth.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée.']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$email = is_array($input) ? ($input['email'] ?? '') : '';
$password = is_array($input) ? ($input['password'] ?? '') : '';

if (!hash_equals(ADMIN_EMAIL, (string) $email) || !hash_equals(ADMIN_PASSWORD, (string) $password)) {
    http_response_code(401);
    echo json_encode(['error' => 'Identifiants incorrects.']);
    exit();
}

echo json_encode(['token' => issue_token()]);
