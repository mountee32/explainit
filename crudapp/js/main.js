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

function fetchQuestions() {
    $.ajax({
        url: 'https://explainit.app/api/read.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            displayQuestions(data);
            displayQuestionCount(data); // Add this line
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
        const deleteButton = $('<button>')
            .addClass('btn btn-danger btn-sm')
            .text('Delete')
            .on('click', function() {
                deleteQuestion(question.id);
            });

        const editButton = $('<button>') // Add an edit button
            .addClass('btn btn-primary btn-sm me-2') // Add me-2 class for spacing
            .text('Edit')
            .on('click', function() {
                editQuestion(question);
            });

        const actionsDiv = $('<div>').addClass('d-flex').append(editButton, deleteButton);

        const row = $('<tr>').append(
            $('<td>').text(question.id),
            $('<td>').text(question.date_reviewed),
            $('<td>').text(question.question),
            $('<td>').text(question.skill),
            $('<td>').append(actionsDiv) // Add the actionsDiv containing the edit and delete buttons
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

function getFormData(form) {
    return {
        id: form.find('[name="id"]').val(),
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



function deleteQuestion(questionId) {
    if (!confirm('Are you sure you want to delete this question?')) {
        return;
    }

    $.ajax({
        url: 'https://explainit.app/api/delete.php',
        method: 'DELETE',
        data: JSON.stringify({ id: questionId }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(data) {
            if (data.message === 'Question deleted successfully.') {
                fetchQuestions();
                alert('Question deleted successfully.');
            } else {
                alert('Error deleting question: ' + data.message);
            }
        },
        error: function(err) {
            console.error('Error deleting question:', err);
        }
    });
}

function createQuestion(questionData) {
    $.ajax({
        url: 'https://explainit.app/api/create.php',
        method: 'POST',
        data: JSON.stringify(questionData),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            if (jqXHR.status === 201) { // Check if the status code is 201
                fetchQuestions();
                $('#questionModal').modal('hide');
                alert('Question added successfully.'); // Show a success message
            } else {
                alert('Error creating question: ' + data.message);
            }
        },
        error: function (err) {
            console.error('Error creating question:', err);
        }
    });
}

function editQuestion(question) {
    const form = $('#questionForm');
    form.find('[name="id"]').val(question.id);
    form.find('[name="question"]').val(question.question);
    form.find('[name="skill"]').val(question.skill);
    form.find('[name="choice1"]').val(question.choice1);
    form.find('[name="choice2"]').val(question.choice2);
    form.find('[name="choice3"]').val(question.choice3);
    form.find('[name="choice4"]').val(question.choice4);
    form.find('[name="correct_choice"]').val(question.correct_choice);
    form.find('[name="explanation1"]').val(question.explanation1);
    form.find('[name="explanation2"]').val(question.explanation2);
    form.find('[name="explanation3"]').val(question.explanation3);
    form.find('[name="explanation4"]').val(question.explanation4);

    $('#saveQuestionBtn').off('click').on('click', function() {
        const updatedQuestionData = getFormData(form);
        const invalidFields = validateQuestionData(updatedQuestionData);
        if (invalidFields.length === 0) {
            updateQuestion(updatedQuestionData);
        } else {
            alert('Please fill in the following required fields: ' + invalidFields.join(', '));
        }
    });

    $('#questionModal').modal('show');
}

function updateQuestion(questionData) {
    $.ajax({
        url: 'https://explainit.app/api/update.php',
        method: 'PUT',
        data: JSON.stringify(questionData),
        contentType: 'application/json',
        dataType: 'json',
        success: function(data) {
            if (data.message === 'Question updated successfully.') {
                fetchQuestions();
                $('#questionModal').modal('hide');
                alert('Question updated successfully.');
            } else {
                alert('Error updating question: ' + data.message);
            }
        },
        error: function(err) {
            console.error('Error updating question:', err);
        }
    });
}
function displayQuestionCount(questions) {
    const questionCount = {
        easy: 0,
        medium: 0,
        hard: 0,
    };

    questions.forEach(question => {
        questionCount[question.skill]++;
    });

    $('#questionCount').text(`Easy: ${questionCount.easy}, Medium: ${questionCount.medium}, Hard: ${questionCount.hard}`);
}

