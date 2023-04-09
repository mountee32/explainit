<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once 'config.php';

$log_file = "create_log.txt";

// Replace this value with your own secret token
$secret_token = 'Jump857571111';

// Check for the Authorization header and validate the token
// if (isset(getallheaders()['Authorization']) && getallheaders()['Authorization'] === 'Bearer ' . $secret_token) {

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

        error_log(date('Y-m-d H:i:s') . " - Received data: " . json_encode($data) . "\n", 3, $log_file);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Question added successfully."));
            error_log(date('Y-m-d H:i:s') . " - Question added successfully.\n", 3, $log_file);
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to add question."));
            error_log(date('Y-m-d H:i:s') . " - Query execution failed. Unable to add question.\n", 3, $log_file);
            error_log("Error details: " . print_r($stmt->errorInfo(), true) . "\n", 3, $log_file);
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to add question. Data is incomplete."));
        error_log(date('Y-m-d H:i:s') . " - Unable to add question. Data is incomplete. Received data: " . json_encode($data) . "\n", 3, $log_file);
    }
    // } else {
    // http_response_code(401);
    // echo json_encode(array("message" => "Unauthorized."));
    // }
    ?>
