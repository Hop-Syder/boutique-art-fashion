<?php
/**
 * Émission et vérification de tokens admin (HMAC signé, sans dépendance).
 * Utilisé par login.php (émission) et upload.php (vérification côté écriture).
 */
require_once __DIR__ . '/_config.php';

function issue_token(): string {
    $payload = base64_encode(json_encode(['exp' => time() + TOKEN_TTL]));
    $sig = hash_hmac('sha256', $payload, TOKEN_SECRET);
    return $payload . '.' . $sig;
}

function verify_token(?string $token): bool {
    if (!$token || !str_contains($token, '.')) return false;
    [$payload, $sig] = explode('.', $token, 2);
    $expected = hash_hmac('sha256', $payload, TOKEN_SECRET);
    if (!hash_equals($expected, $sig)) return false;
    $data = json_decode(base64_decode($payload), true);
    return is_array($data) && isset($data['exp']) && $data['exp'] > time();
}

function bearer_token(): ?string {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    if (str_starts_with($auth, 'Bearer ')) return substr($auth, 7);
    return null;
}

function require_admin_token(): void {
    if (!verify_token(bearer_token())) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Non autorisé. Reconnectez-vous à l\'admin.']);
        exit();
    }
}
