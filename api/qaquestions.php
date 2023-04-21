<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE, PUT, GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$secret_token = 'Jump857571111';
$log_file = 'api-log.txt';
date_default_timezone_set('UTC');
$time_stamp = date('Y-m-d H:i:s');
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
file_put_contents($log_file, "{$time_stamp} - api - Raw input data: " . file_get_contents("php://input") . "\n", FILE_APPEND);
file_put_contents($log_file, "{$time_stamp} - api - Received data: " . json_encode($data) . "\n", FILE_APPEND);
file_put_contents($log_file, "{$time_stamp} - api - Action: " . (isset($data['action']) ? $data['action'] : (isset($_GET['action']) ? $_GET['action'] : 'None')) . "\n", FILE_APPEND);

$action = isset($data['action']) ? $data['action'] : (isset($_GET['action']) ? $_GET['action'] : null);

if ($action === 'create') {
    file_put_contents($log_file, "{$time_stamp} - api - Entered 'create' action\n", FILE_APPEND);
    file_put_contents($log_file, "{$time_stamp} - api - Checking if data is complete\n", FILE_APPEND);

    if (!empty($data['category']) && !empty($data['question']) && !empty($data['answer'])) {
        // Debug information
        file_put_contents($log_file, "{$time_stamp} - api - Category: {$data['category']}, Question: {$data['question']}, Answer: {$data['answer']}, Link: {$data['link']}\n", FILE_APPEND);
        
        $stmt = $conn->prepare("INSERT INTO qa_questions (id, category, question, answer, link) VALUES (NULL, :category, :question, :answer, :link)");
        $stmt->bindParam(':category', $data['category']);
        $stmt->bindParam(':question', $data['question']);
        $stmt->bindParam(':answer', $data['answer']);
        $stmt->bindParam(':link', $data['link']);
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Question added successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to add question."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to add question. Data is incomplete."));
    }
}

 elseif ($action === 'delete') {
    if (!empty($data['id'])) {
        $stmt = $conn->prepare("DELETE FROM qa_questions WHERE id = :id");
        $stmt->bindParam(':id', $data['id']);
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Question deleted successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to delete question."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to delete question. ID is missing."));
    }
} elseif ($action === 'update') {
    if (!empty($data['id']) && !empty($data['category']) && !empty($data['question']) && !empty($data['answer'])) {
        $stmt = $conn->prepare("UPDATE qa_questions SET category = :category, question = :question, answer = :answer, link = :link WHERE id = :id");
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':category', $data['category']);
        $stmt->bindParam(':question', $data['question']);
        $stmt->bindParam(':answer', $data['answer']);
        $stmt->bindParam(':link', $data['link']);
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Question updated successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update question."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update question. Data is incomplete."));
    }
} elseif ($action === 'read') {
    if (isset($_GET['id'])) {
        $stmt = $conn->prepare("SELECT * FROM qa_questions WHERE id = :id");
        $stmt->bindParam(':id', $_GET['id']);
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
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid action."));
}
?>
