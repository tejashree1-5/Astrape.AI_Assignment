<?php
require '../db.php';
$query = "SELECT * FROM items WHERE 1=1";

if (isset($_GET['category'])) {
    $cat = $_GET['category'];
    $query .= " AND category='$cat'";
}
if (isset($_GET['min_price']) && isset($_GET['max_price'])) {
    $min = $_GET['min_price'];
    $max = $_GET['max_price'];
    $query .= " AND price BETWEEN $min AND $max";
}

$result = $conn->query($query);
$items = [];
while($row = $result->fetch_assoc()) {
    $items[] = $row;
}
echo json_encode($items);
?>
