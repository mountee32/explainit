function deleteQuestion(id) {
    // Send
    $.ajax({
        url: 'https://explainit.app/api/delete.php',
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ id: id }),
        success: function (response) {
            console.log(response);
            alert('Question deleted successfully.');
            // Reload the questions after deleting the record
            loadQuestions();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            alert('Unable to delete question.');
        }
    });
}
