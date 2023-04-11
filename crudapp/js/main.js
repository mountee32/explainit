$(document).ready(function() {
    fetchQuestions();
});

function fetchQuestions() {
    $.ajax({
        url: 'https://explainit.app/api/read.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            displayQuestions(data);
        },
        error: function(err) {
            console.error('Error fetching questions:', err);
        }
    });
}

function displayQuestions(questions) {
    const tableBody = $('#questionTableBody');
    tableBody.empty();

    const groupedQuestions = groupAndSortQuestions(questions);

    groupedQuestions.forEach(function(question) {
        const row = $('<tr>').append(
            $('<td>').text(question.id),
            $('<td>').text(question.date_reviewed),
            $('<td>').text(question.question),
            $('<td>').text(question.skill),
            $('<td>') // Actions column will be filled in future releases
        );
        tableBody.append(row);
    });
}

function groupAndSortQuestions(questions) {
    const skillOrder = ['easy', 'medium', 'hard'];

    return questions
        .sort((a, b) => a.question.localeCompare(b.question))
        .sort((a, b) => skillOrder.indexOf(a.skill) - skillOrder.indexOf(b.skill));
}
