<?php
// hosted at https://ai4chistians.com/api/chat.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$log_file = 'api-log.txt';
date_default_timezone_set('UTC');
$time_stamp = date('Y-m-d H:i:s');

// Load environment variables from .env file
$env = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/.env');

// Capture POST data
$json = file_get_contents('php://input');
$obj = json_decode($json, true);
$message = $obj['message'];
$chat_log = $obj['chat_log'];

file_put_contents($log_file, "{$time_stamp} - chat.php - Raw input data: " . $json . "\n", FILE_APPEND);

$url = 'https://api.openai.com/v1/chat/completions';

if ($chat_log == null) {
    $chat_log = array(
        array('role' => 'system', 'content' => 'You are a Christian Apologetics Expert.')
    );
}

array_push($chat_log, array('role' => 'user', 'content' => $message));

$data = array(
    'model' => 'gpt-3.5-turbo',
    'messages' => $chat_log
);

file_put_contents($log_file, "{$time_stamp} - chat.php - Data to be sent to API: " . json_encode($data) . "\n", FILE_APPEND);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\nAuthorization: Bearer " . $env['OPENAI_API_KEY'] . "\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
    ),
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) { 
    /* Handle error */
    file_put_contents($log_file, "{$time_stamp} - chat.php - API call failed.\n", FILE_APPEND);
} else {
    $result = json_decode($result);
    $answer = $result->choices[0]->message->content;

    file_put_contents($log_file, "{$time_stamp} - chat.php - API call succeeded, received answer: {$answer}\n", FILE_APPEND);

    array_push($chat_log, array('role' => 'assistant', 'content' => $answer));
    $response = array(
        'answer' => $answer,
        'chat_log' => $chat_log
    );
    echo json_encode($response);
}
?>
