<?php
/**
 * POST   /api/upload.php               → upload d'une image produit (admin only)
 * DELETE /api/upload.php?filename=xxx  → suppression d'une image (admin only)
 */
require_once __DIR__ . '/_auth.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$upload_dir = __DIR__ . '/../uploads/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 Mo
const ALLOWED_MIME = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin_token();

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["error" => "Aucun fichier reçu ou erreur d'upload."]);
        exit();
    }

    $file = $_FILES['image'];

    if ($file['size'] > MAX_UPLOAD_BYTES) {
        http_response_code(413);
        echo json_encode(["error" => "Fichier trop volumineux (max 8 Mo)."]);
        exit();
    }

    // Vérifie le vrai type MIME du contenu binaire, pas l'extension déclarée
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!isset(ALLOWED_MIME[$mime])) {
        http_response_code(400);
        echo json_encode(["error" => "Format non supporté (JPEG, PNG, WEBP, GIF uniquement)."]);
        exit();
    }

    $ext = ALLOWED_MIME[$mime];
    $filename = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $destination = $upload_dir . $filename;

    if (move_uploaded_file($file['tmp_name'], $destination)) {
        echo json_encode(["url" => '/uploads/' . $filename, "filename" => $filename]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Erreur lors de l'enregistrement du fichier."]);
    }
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    require_admin_token();

    $filename = basename($_GET['filename'] ?? '');
    $target = $upload_dir . $filename;
    if ($filename !== '' && file_exists($target)) {
        unlink($target);
        echo json_encode(["ok" => true]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Fichier introuvable."]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Méthode non autorisée."]);
