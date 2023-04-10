<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
error_reporting(E_ALL);
include_once 'config.php';

// Replace this value with your own secret token
$secret_token = 'Jump857571111';
$log_file = 'api-log.txt';
date_default_timezone_set('UTC');
$time_stamp = date('Y-m-d H:i:s');

// Log the connection details
file_put_contents($log_file, "update api - Database connection details: " . print_r($conn, true) . "\n", FILE_APPEND);

// Check that the connection object is not null and is an instance of the PDO class
if (!is_null($conn) && $conn instanceof PDO) {
    // Connection is valid
} else {
    // Connection is invalid
}

// Check for the Authorization header and validate the token
// if (isset(getallheaders()['Authorization']) && getallheaders()['Authorization'] === 'Bearer ' . $secret_token) {

    $data = json_decode(file_get_contents("php://input"), true);
    file_put_contents($log_file, "{$time_stamp} - update api - Raw input data: " . file_get_contents("php://input") . "\n", FILE_APPEND);
    file_put_contents($log_file, "{$time_stamp} - update api - Received data: " . json_encode($data) . "\n", FILE_APPEND);
    if (
        !empty($data['id']) &&
        !empty($data['question']) &&
        !empty($data['skill']) &&
        !empty($data['choices']) &&
        isset($data['correct']) &&
        !empty($data['explanations'])
    ) {
        file_put_contents($log_file, "{$time_stamp} - update api - Good it's not blank: " . json_encode($data) . "\n", FILE_APPEND);
        $sql = "
        UPDATE questions SET
        question = :question,
        skill = :skill,
        choice1 = :choice1,
        choice2 = :choice2,
        choice3 = :choice3,
        choice4 = :choice4,
        correct_choice = :correct_choice,
        explanation1 = :explanation1,
        explanation2 = :explanation2,
        explanation3 = :explanation3,
        explanation4 = :explanation4
        WHERE id = :id
    ";
    file_put_contents($log_file, "{$time_stamp} - update api - Prepared SQL query step 1: {$sql}\n", FILE_APPEND);
    $stmt = $conn->prepare($sql);
        file_put_contents($log_file, "{$time_stamp} - update api - Prepared SQL query step 2: {$stmt}\n", FILE_APPEND);
        $stmt->bindParam(':id', $data['id']);
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
        file_put_contents($log_file, "{$time_stamp} - update api - Prepared SQL query step 3: {$stmt}\n", FILE_APPEND);
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Question updated successfully."));
            file_put_contents($log_file, "{$time_stamp}
            update api - question updated successfully.\n", FILE_APPEND);
        } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update question."));
        file_put_contents($log_file, "{$time_stamp} - update api - error updating sql.: {$e->getMessage()}\n", FILE_APPEND);
        }
        } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update question. Data is incomplete."));
        file_put_contents($log_file, "{$time_stamp} - update api - incomplete data: " . json_encode($data) . "\n", FILE_APPEND);
        }
        // } else {
        // http_response_code(401);
        // echo json_encode(array("message" => "Unauthorized."));
        // }