<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include_once 'config.php';

$query = "SELECT * FROM questions";
$stmt = $conn->prepare($query);
$stmt->execute();

$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($results);
