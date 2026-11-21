<?php
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["ok" => false]);
    exit;
}

echo json_encode([
    "ok" => true,
    "user_id" => $_SESSION['user_id'],
    "username" => $_SESSION['username'],
]);
