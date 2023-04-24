<?php
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host = $_ENV['HOST'];
$db_name = $_ENV['DB_NAME'];
$username = $_ENV['USERNAME'];
$password = $_ENV['PASSWORD'];
$log_file = $_ENV['LOG_FILE'];

date_default_timezone_set('UTC');
$time_stamp = date('Y-m-d H:i:s');

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

try {
    $conn = new PDO("mysql:host={$host};dbname={$db_name}", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $exception) {
    echo "Connection error: " . $exception->getMessage();
}

if (!is_null($conn) && $conn instanceof PDO) {
    file_put_contents($log_file, "config.php - Database connection valid.\n", FILE_APPEND);
} else {
    file_put_contents($log_file, "config.php - Database connection invalid.\n", FILE_APPEND);
}
