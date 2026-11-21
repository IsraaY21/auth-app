<?php
require 'guard.php';

echo json_encode([
    "ok" => true,
    "user_id" => $_SESSION['user_id'],
    "username" => $_SESSION['username'],
]);
