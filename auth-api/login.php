<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$password = $data['password'];
$remember = !empty($data['remember']);
$key = hash('sha256', strtolower($username) . '|' . $_SERVER['REMOTE_ADDR']);

$stmt = $conn->prepare("SELECT 1 FROM login_attempts WHERE rate_key = ? AND lock_until > NOW()");
$stmt->bind_param("s", $key);
$stmt->execute();

if ($stmt->get_result()->num_rows > 0) {
    http_response_code(429);
    echo json_encode(["error" => "Too many failed attempts. Try again in 3 minutes."]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    $stmt = $conn->prepare("DELETE FROM login_attempts WHERE rate_key = ?");
    $stmt->bind_param("s", $key);
    $stmt->execute();

    session_regenerate_id(true);
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];

    if ($remember) {
        $cookie = session_get_cookie_params();
        setcookie(session_name(), session_id(), [
            'expires' => time() + 60 * 60 * 24 * 30,
            'path' => $cookie['path'],
            'domain' => $cookie['domain'],
            'secure' => $cookie['secure'],
            'httponly' => $cookie['httponly'],
            'samesite' => $cookie['samesite'],
        ]);
    }

    echo json_encode([
        "success" => true,
        "user_id" => $user['id'],
        "username" => $user['username'],
    ]);
} else {
    $stmt = $conn->prepare("
        INSERT INTO login_attempts (rate_key, failures) VALUES (?, 1)
        ON DUPLICATE KEY UPDATE
            failures = IF(lock_until <= NOW(), 1, failures + 1),
            lock_until = IF(failures >= 3, NOW() + INTERVAL 3 MINUTE, NULL)
    ");
    $stmt->bind_param("s", $key);
    $stmt->execute();

    http_response_code(401);
    echo json_encode(["error" => "Wrong username or password"]);
}