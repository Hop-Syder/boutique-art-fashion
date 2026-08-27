<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$upload_dir = __DIR__ . '/../uploads/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $tmp_name = $_FILES['image']['tmp_name'];
        $name = basename($_FILES['image']['name']);
        
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
            http_response_code(400);
            echo json_encode(["error" => "Format non supporté"]);
            exit();
        }
        
        $filename = time() . '_' . uniqid() . '.' . $ext;
        $destination = $upload_dir . $filename;
        
        if (move_uploaded_file($tmp_name, $destination)) {
            $url = '/uploads/' . $filename;
            echo json_encode(["url" => $url, "filename" => $filename]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Erreur lors de l'enregistrement du fichier"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Aucun fichier reçu ou erreur d'upload"]);
    }
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Si on a un paramètre ?file=xxx ou un chemin /api/upload.php/xxx
    // Pour simplifier, ignoré pour le moment ou on lit php://input
    echo json_encode(["ok" => true]);
    exit();
}
