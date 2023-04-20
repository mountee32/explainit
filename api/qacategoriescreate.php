<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$secret_token = 'Jump857571111';
$log_file = 'api-log.txt';
date_default_timezone_set('UTC');
$time_stamp = date('Y-m-d H:i:s');
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
file_put_contents($log_file, "{$time_stamp} - create api - Raw input data: " . file_get_contents("php://input") . "\n", FILE_APPEND);
file_put_contents($log_file, "{$time_stamp} - create api - Received data: " . json_encode($data) . "\n", FILE_APPEND);

if (
    !empty($data['title'])
) {
    $sql = "INSERT INTO qa_categories (
        id, title
    ) VALUES (
        NULL, :title
    )";

    file_put_contents($log_file, "{$time_stamp} - create api - Prepared SQL query: {$sql}\n", FILE_APPEND);

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':title', $data['title']);

    file_put_contents($log_file, "{$time_stamp} - create api - Executing the INSERT query...\n", FILE_APPEND);
    try {
        $result = $stmt->execute();
    } catch (PDOException $e) {
        file_put_contents($log_file, "{$time_stamp} - create api - Error executing the INSERT query: {$e->getMessage()}\n", FILE_APPEND);
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add category."));
        exit;
    }

    if ($result) {
        file_put_contents($log_file, "{$time_stamp} - create api - INSERT query executed successfully.\n", FILE_APPEND);
        http_response_code(201);
        echo json_encode(array("message" => "Category added successfully."));
    } else {
        file_put_contents($log_file, "{$time_stamp} - create api - Failed to execute the INSERT query.\n", FILE_APPEND);
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add category."));
    }
} else {
    file_put_contents($log_file, "{$time_stamp} - create api - Unable to add category. Data is incomplete.\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(array("message" => "Unable to add category. Data is incomplete."));
}
?>
