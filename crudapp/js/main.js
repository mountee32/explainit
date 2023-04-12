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
        const invalidFields = validateQuestionData(questionData);
        if (invalidFields.length === 0) {
            createQuestion(questionData);
        } else {
            alert('Please fill in the following required fields: ' + invalidFields.join(', '));
        }
    });
});
function getFormData(form) {
    return {
        question: form.find('[name="question"]').val(),
        skill: form.find('[name="skill"]').val(),
        choices: [
            form.find('[name="choice1"]').val(),
            form.find('[name="choice2"]').val(),
            form.find('[name="choice3"]').val(),
            form.find('[name="choice4"]').val()
        ],
        correct: parseInt(form.find('[name="correct_choice"]').val(), 10),
        explanations: [
            form.find('[name="explanation1"]').val(),
            form.find('[name="explanation2"]').val(),
            form.find('[name="explanation3"]').val(),
            form.find('[name="explanation4"]').val()
        ]
    };
}



function validateQuestionData(questionData) {
    const invalidFields = [];

    if (!questionData.question) invalidFields.push('Question');
    if (!questionData.skill) invalidFields.push('Skill');
    if (!questionData.choices.every(choice => choice)) invalidFields.push('Choices');
    if (!Number.isInteger(questionData.correct)) invalidFields.push('Correct Choice');
    if (!questionData.explanations.every(explanation => explanation)) invalidFields.push('Explanations');

    return invalidFields;
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






