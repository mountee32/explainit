<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once 'config.php';

// Replace this value with your own secret token
$secret_token = 'Jump857571111';

// Check for the Authorization header and validate the token
if (isset(getallheaders()['Authorization']) && getallheaders()['Authorization'] === 'Bearer ' . $secret_token) {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data['id'])) {
        $stmt = $conn->prepare("DELETE FROM questions WHERE id = :id");
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
} else {
    http_response_code(401);
    echo json_encode(array("message" => "Unauthorized."));
}
