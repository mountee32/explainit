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
    !empty($data['question']) &&
    !empty($data['skill']) &&
    !empty($data['choices']) &&
    isset($data['correct']) &&
    !empty($data['explanations'])
) {
    $sql = "INSERT INTO quiz (
        id, date_reviewed, question, skill,
        choice1, choice2, choice3, choice4,
        correct_choice,
        explanation1, explanation2, explanation3, explanation4
    ) VALUES (
        NULL, NULL, :question, :skill,
        :choice1, :choice2, :choice3, :choice4,
        :correct_choice,
        :explanation1, :explanation2, :explanation3, :explanation4
    )";

    file_put_contents($log_file, "{$time_stamp} - create api - Prepared SQL query: {$sql}\n", FILE_APPEND);

    $stmt = $conn->prepare($sql);

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

    file_put_contents($log_file, "{$time_stamp} - create api - Executing the INSERT query...\n", FILE_APPEND);
    try {
        $result = $stmt->execute();
    } catch (PDOException $e) {
        file_put_contents($log_file, "{$time_stamp} - create api - Error executing the INSERT query: {$e->getMessage()}\n", FILE_APPEND);
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add question."));
        exit;
    }

    if ($result) {
        file_put_contents($log_file, "{$time_stamp} - create api - INSERT query executed successfully.\n", FILE_APPEND);
        http_response_code(201);
        echo json_encode(array("message" => "Question added successfully."));
    } else {
        file_put_contents($log_file, "{$time_stamp} - create api - Failed to execute the INSERT query.\n", FILE_APPEND);
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add question."));
    }
}else {
    file_put_contents($log_file, "{$time_stamp} - create api - Unable to add question. Data is incomplete.\n", FILE_APPEND);
http_response_code(400);
echo json_encode(array("message" => "Unable to add question. Data is incomplete."));
}
?>