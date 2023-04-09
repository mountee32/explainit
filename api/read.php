<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once 'config.php';

// Replace this value with your own secret API key
$api_key = '55556666';

// Check for the Authorization header and validate the API key
// if (isset(getallheaders()['Authorization']) && getallheaders()['Authorization'] === 'Bearer ' . $api_key) {

    $stmt = $conn->prepare("SELECT * FROM questions");
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No questions found."));
    }
// } else {
//     http_response_code(401);
//     echo json_encode(array("message" => "Unauthorized."));
// }
