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

$action = isset($data['action']) ? $data['action'] : (isset($_GET['action']) ? $_GET['action'] : null);

if ($action === 'create') {
    if (!empty($data['title'])) {
        $stmt = $conn->prepare("INSERT INTO st_categories (id, title) VALUES (NULL, :title)");
        $stmt->bindParam(':title', $data['title']);
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Category added successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to add category."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to add category. Data is incomplete."));
    }
} elseif ($action === 'delete') {
    if (!empty($data['id'])) {
        $stmt = $conn->prepare("DELETE FROM st_categories WHERE id = :id");
        $stmt->bindParam(':id', $data['id']);
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Category deleted successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to delete category."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to delete category. ID is missing."));
    }
} elseif ($action === 'update') {
    if (!empty($data['id']) && !empty($data['title'])) {
        $stmt = $conn->prepare("UPDATE st_categories SET title = :title WHERE id = :id");
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':title', $data['title']);
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Category updated successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update category."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update category. Data is incomplete."));
    }
} elseif ($action === 'read') {
    if (isset($_GET['id'])) {
        $stmt = $conn->prepare("SELECT * FROM st_categories WHERE id = :id");
        $stmt->bindParam(':id', $_GET['id']);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Category not found."));
        }
    } else {
        $stmt = $conn->prepare("SELECT * FROM st_categories");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No categories found."));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid action."));
}
?>
