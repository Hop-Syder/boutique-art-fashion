<?php
/**
 * GET  /api/data.php → lit le snapshot complet (produits, catégories,
 *                       commandes, réglages, ...) — lecture publique, le
 *                       storefront en a besoin pour s'hydrater.
 * POST /api/data.php → réécrit le snapshot complet, en ATOMIQUE (fichier
 *                       temporaire + rename) pour éviter toute corruption
 *                       en cas d'écritures concurrentes.
 *
 * Volontairement NON protégé par token : le storefront pousse aussi ce
 * même endpoint quand un client passe commande (voir StoreContext.createOrder
 * → storageService.saveOrders → scheduleServerSync), donc exiger un token
 * admin ici casserait le checkout. Le vrai correctif propre serait de
 * scinder "catalogue" (admin-only) et "commandes" (public) en deux payloads
 * distincts — non fait ici pour rester dans le périmètre du bug signalé.
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$db_file = __DIR__ . '/../db.json';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($db_file)) {
        $fp = fopen($db_file, 'r');
        flock($fp, LOCK_SH);
        echo stream_get_contents($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
    } else {
        echo json_encode(new stdClass());
    }
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');

    if (json_decode($input) === null) {
        http_response_code(400);
        echo json_encode(["error" => "Payload JSON invalide."]);
        exit();
    }

    $tmp = $db_file . '.tmp.' . bin2hex(random_bytes(6));
    if (file_put_contents($tmp, $input, LOCK_EX) === false) {
        http_response_code(500);
        echo json_encode(["error" => "Impossible d'écrire les données."]);
        exit();
    }
    rename($tmp, $db_file);
    echo json_encode(["ok" => true]);
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Méthode non autorisée."]);
