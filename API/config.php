<?php
$host = 'localhost';
$db_name = 'u383132761_explaint';
$username = 'u383132761_GG78';
$password = 'Jump6565%True';

try {
    $conn = new PDO("mysql:host={$host};dbname={$db_name}", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $exception) {
    echo "Connection error: " . $exception->getMessage();
}
