<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once 'config.php';

// Replace this value with your own secret token
$secret_token = 'Jump857571111';

$data = json_decode(file_get_contents("php://input"), true);

if (
    !empty($data['question']) &&
    !empty($data['skill']) &&
    !empty($data['choices']) &&
    isset($data['correct']) &&
    !empty($data['explanations'])
) {
    $stmt = $conn->prepare("INSERT INTO questions (
        id, date_reviewed, question, skill,
        choice1, choice2, choice3, choice4,
        correct_choice,
        explanation1, explanation2, explanation3, explanation4
    ) VALUES (
        NULL, NULL, :question, :skill,
        :choice1, :choice2, :choice3, :choice4,
        :correct_choice,
        :explanation1, :explanation2, :explanation3, :explanation4
    )");

    $stmt->bindParam(':question', $data['question']);
    $stmt->bindParam(':skill', $data['skill']);
    $stmt->bindParam(':choice1', $data['choices'][0]);
    $stmt->bindParam(':choice2', $data['choices'][1]);
    $stmt->bindParam(':choice3', $data['choices'][2]);
    $stmt->bindParam(':choice4', $data['choices'][3]);
    $stmt->bindParam(':correct_choice', $data['correct']);
    $stmt->bindParam(':explanation1', $data['explanations'][0]);
    $stmt->bindParam(':explanation2', $data['explanations'][1]);
    $stmt->bindParam(':explanation3', $data['explanations'][2]);
    $stmt->bindParam(':explanation4', $data['explanations'][3]);

    $log_msg = date('Y-m-d H:i:s') . " - create api - Executing the INSERT query...\n";
    file_put_contents('api-log.txt', $log_msg, FILE_APPEND);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Question added successfully."));
        $log_msg = date('Y-m-d H:i:s') . " - create api - INSERT query executed successfully.\n";
        file_put_contents('api-log.txt', $log_msg, FILE_APPEND);
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add question."));
        $error_info = $stmt->errorInfo();
        $log_msg = date('Y-m-d H:i:s') . " - create api - INSERT query failed. Error: " . implode(" - ", $error_info) . "\n";
        file_put_contents('api-log.txt', $log_msg, FILE_APPEND);
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to add question. Data is incomplete."));
    $log_msg = date('Y-m-d H:i:s') . " - create api - Data is incomplete. Received data: " . json_encode($data) . "\n";
    file_put_contents('api-log.txt', $log_msg, FILE_APPEND);
}