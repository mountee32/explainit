<?php

// Get the JSON data from the request
$data = json_decode($_POST['questions']);

// Write the updated data to the questions.json file
file_put_contents('questions.json', json_encode($data, JSON_PRETTY_PRINT));

?>
