<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// hosted https://ai4christians.com/api/quiz.php
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
    if (!empty($data['question']) && !empty($data['skill']) && !empty($data['choice1']) && !empty($data['choice2']) && !empty($data['choice3']) && !empty($data['choice4']) && isset($data['correct_choice']) && !empty($data['explanation1']) && !empty($data['explanation2']) && !empty($data['explanation3']) && !empty($data['explanation4'])) {
        $stmt = $conn->prepare("INSERT INTO quiz ( question, skill, choice1, choice2, choice3, choice4, correct_choice, explanation1, explanation2, explanation3, explanation4, category, status) VALUES ( :question, :skill, :choice1, :choice2, :choice3, :choice4, :correct_choice, :explanation1, :explanation2, :explanation3, :explanation4, :category, :status)");
        $stmt->bindParam(':question', $data['question']);
        $stmt->bindParam(':skill', $data['skill']);
        $stmt->bindParam(':choice1', $data['choice1']);
        $stmt->bindParam(':choice2', $data['choice2']);
        $stmt->bindParam(':choice3', $data['choice3']);
        $stmt->bindParam(':choice4', $data['choice4']);
        $stmt->bindParam(':correct_choice', $data['correct_choice']);
        $stmt->bindParam(':explanation1', $data['explanation1']);
        $stmt->bindParam(':explanation2', $data['explanation2']);
        $stmt->bindParam(':explanation3', $data['explanation3']);
        $stmt->bindParam(':explanation4', $data['explanation4']);
        $stmt->bindParam(':category', $data['category']);
        $stmt->bindParam(':status', $data['status']);
        if ($stmt->execute()) {
            file_put_contents($log_file, "{$time_stamp} - api - MySQL Insert Success: " . json_encode($stmt->errorInfo()) . "\n", FILE_APPEND);
            http_response_code(201);
            echo json_encode(array("message" => "Question added successfully."));
        } else {
            file_put_contents($log_file, "{$time_stamp} - api - MySQL Insert Failed: " . json_encode($stmt->errorInfo()) . "\n", FILE_APPEND);
            http_response_code(503);
            echo json_encode(array("message" => "Unable to add question."));
        }
    } // This is the missing closing bracket
} elseif ($action === 'delete') {
    if (!empty($data['id'])) {
        $stmt = $conn->prepare("DELETE FROM quiz WHERE id = :id");
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
} 


elseif ($action === 'update') {
    if (!empty($data['id'])) {
        $updateFields = array();

        // Check if any of the required fields are present and not empty
        $requiredFields = array('question', 'skill', 'choice1', 'choice2', 'choice3', 'choice4', 'correct_choice', 'explanation1', 'explanation2', 'explanation3', 'explanation4', 'category', 'status');
        foreach ($requiredFields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                $updateFields[] = "$field = :$field";
            }
        }

        if (!empty($updateFields)) {
            $fieldPlaceholders = implode(', ', $updateFields);

            $stmt = $conn->prepare("UPDATE quiz SET $fieldPlaceholders WHERE id = :id");
            $stmt->bindParam(':id', $data['id']);
            foreach ($updateFields as $field) {
                $fieldParts = explode(' = ', $field);
                $fieldKey = ':' . $fieldParts[0];
                $fieldValue = $data[$fieldParts[0]];
                $stmt->bindParam($fieldKey, $fieldValue);
            }

            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Question updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update question."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to update question. No fields to update."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update question. ID is missing."));
    }

} elseif ($action === 'read') {
    if (isset($_GET['id'])) {
        $stmt = $conn->prepare("SELECT * FROM quiz WHERE id = :id");
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
        $stmt = $conn->prepare("SELECT * FROM quiz");
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
} elseif ($action === 'read_category') {
    $stmt = $conn->prepare("SELECT DISTINCT category FROM quiz ORDER BY category ASC");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No categories found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid action."));
}
?>