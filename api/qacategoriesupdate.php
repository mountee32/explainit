<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
error_reporting(E_ALL);
include_once 'config.php';
// test with curl -X PUT -H "Content-Type: application/json" -d '{"id": 1, "title": "Updated Sample Category"}' https://explainit.app/api/qacategoriesupdate.php

$secret_token = 'Jump857571111';
$log_file = 'api-log.txt';
date_default_timezone_set('UTC');
$time_stamp = date('Y-m-d H:i:s');

if (!is_null($conn) && $conn instanceof PDO) {
    // Connection is valid
} else {
    // Connection is invalid
}

$data = json_decode(file_get_contents("php://input"), true);
file_put_contents($log_file, "{$time_stamp} - update api - Raw input data: " . file_get_contents("php://input") . "\n", FILE_APPEND);
file_put_contents($log_file, "{$time_stamp} - update api - Received data: " . json_encode($data) . "\n", FILE_APPEND);

if (
    !empty($data['id']) &&
    !empty($data['title'])
) {
    $sql = "
        UPDATE qa_categories SET
        title = :title
        WHERE id = :id
    ";

    file_put_contents($log_file, "{$time_stamp} - update api - Prepared SQL query: {$sql}\n", FILE_APPEND);
    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':id', $data['id']);
    $stmt->bindParam(':title', $data['title']);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Category updated successfully."));
        file_put_contents($log_file, "{$time_stamp} - update api - category updated successfully.\n", FILE_APPEND);
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update category."));
        file_put_contents($log_file, "{$time_stamp} - update api - error updating sql.: {$e->getMessage()}\n", FILE_APPEND);
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update category. Data is incomplete."));
    file_put_contents($log_file, "{$time_stamp} - update api - incomplete data: " . json_encode($data) . "\n", FILE_APPEND);
}
?>
