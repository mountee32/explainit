<?php
$env = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/.env');
$host = 'localhost';
$db_name = $env['DB_NAME'];
$username = $env['DB_USERNAME'];
$password = $env['DB_PASSWORD'];
$log_file = 'api-log.txt';
date_default_timezone_set('UTC');
$time_stamp = date('Y-m-d H:i:s');
// Set the response headers - updated
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
    // Connection is valid
    file_put_contents($log_file, "{$time_stamp} config.php - Database connection valid.\n", FILE_APPEND);
  
} else {
    // Connection is invalid
    file_put_contents($log_file, "{$time_stamp} config.php - Database connection invalid.\n", FILE_APPEND);
}
