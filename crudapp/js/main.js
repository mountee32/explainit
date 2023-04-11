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
$(document).ready(function() {
    fetchQuestions();

    $('#saveQuestionBtn').on('click', function() {
        const questionData = getFormData($('#questionForm'));
        if (validateQuestionData(questionData)) {
            createQuestion(questionData);
        } else {
            alert('Please fill in all required fields.');
        }
    });
});

function getFormData(form) {
    return {
        date_reviewed: form.find('[name="date_reviewed"]').val(),
        question: form.find('[name="question"]').val(),
        skill: form.find('[name="skill"]').val()
    };
}


function validateQuestionData(questionData) {
    return questionData.date_reviewed && questionData.question && questionData.skill;
}

function createQuestion(questionData) {
    $.ajax({
        url: 'https://explainit.app/api/create.php',
        method: 'POST',
        data: JSON.stringify(questionData),
        contentType: 'application/json',
        dataType: 'json',
        success: function(data) {
            if (data.status === 'success') {
                fetchQuestions();
                $('#questionModal').modal('hide');
            } else {
                alert('Error creating question: ' + data.message);
            }
        },
        error: function(err) {
            console.error('Error creating question:', err);
        }
    });
}

