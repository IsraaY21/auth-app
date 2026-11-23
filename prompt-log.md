# Prompt
You are a senior PHP developer helping me add more security to my code
Here is my code
```
login.php
<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$password = $data['password'];
$remember = !empty($data['remember']);

$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
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
    http_response_code(401);
    echo json_encode(["error" => "Wrong username or password"]);
}
```
Add a simple security feature that limits failed logins meaning if someone tries to login to many times , refuse to login for 3min
the limit is 3 times
the point of this code is add another security layer to the code

give me the response as step by step with explanations
use the added code as a reference to keep the code clean

only use built in php functions, no need to create new files, keep the new code inside the login file


-----------------
What I liked about AI's answer that it gave me tips for improvements for example limit the login attempts using database not sessions, since the user can just simply delete the sessions

But the first code AI gave me locked after 2 failures not 3, which proves that we need to test the code AI generates
