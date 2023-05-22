<?php
    // require 'vendor/autoload.php';
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $message = $_POST['message'];
    $chat_log = $_POST['chat_log'];
    
    $url = 'https://api.openai.com/v1/engines/davinci-codex/chat/completions';

    if ($chat_log == null) {
        $chat_log = array(
            array('role' => 'system', 'content' => 'You are a Christian Apologetics Expert.')
        );
    }

    array_push($chat_log, array('role' => 'user', 'content' => $message));

    $data = array(
        'messages' => $chat_log
    );

    $options = array(
        'http' => array(
            'header'  => "Content-type: application/json\r\nAuthorization: Bearer " . getenv('OPENAI_API_KEY') . "\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ),
    );

    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result === FALSE) { 
        /* Handle error */
    } else {
        $result = json_decode($result);
        $answer = $result->choices[0]->message->content;
        array_push($chat_log, array('role' => 'assistant', 'content' => $answer));
        $response = array(
            'answer' => $answer,
            'chat_log' => $chat_log
        );
        echo json_encode($response);
    }
?>
