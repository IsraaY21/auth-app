<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$password = password_hash($data['password'], PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $password);

try {
    $stmt->execute();
    echo json_encode(["success" => true]);
} catch (mysqli_sql_exception $e) {
    if ($e->getCode() == 1062) {
        http_response_code(409);
        echo json_encode(["error" => "Username already taken"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Something went wrong"]);
    }
}