<?php
// curl -X GET "https://explainit.app/api/qaquestionsread.php?id=1"

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
$log_file = 'api-log.txt';
date_default_timezone_set('UTC');
$time_stamp = date('Y-m-d H:i:s');
include_once 'config.php';

if (!$conn) {
    http_response_code(500);
    echo json_encode(array("message" => "Error: Unable to connect to the database."));
    exit();
}

if (isset($_GET['id'])) {
    $stmt = $conn->prepare("SELECT * FROM qa_questions WHERE id = :id");
    $stmt->bindParam(":id", $_GET['id']);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Question not found."));
    }
} else {
    $stmt = $conn->prepare("SELECT * FROM qa_questions");
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No questions found."));
    }
}
?>