<?php
header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$user = $data['username'] ?? '';
$pass = $data['password'] ?? '';

$stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

if ($result && password_verify($pass, $result['password'])) {
    echo json_encode(["message" => "Login successful"]);
} else {
    echo json_encode(["error" => "Invalid username or password"]);
}
?>

