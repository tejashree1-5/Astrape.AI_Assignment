<?php
require '../db.php';
$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'];
$item_id = $data['item_id'];

$stmt = $conn->prepare("INSERT INTO cart (user_id, item_id) VALUES (?, ?)");
$stmt->bind_param("ii", $user_id, $item_id);
$stmt->execute();
echo json_encode(["message" => "Item added to cart"]);
?>
