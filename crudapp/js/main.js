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
        date_reviewed: form.find('[name="date_reviewed"]').val(),
        question: form.find('[name="question"]').val(),
        skill: form.find('[name="skill"]').val(),
        choice1: form.find('[name="choice1"]').val(),
        choice2: form.find('[name="choice2"]').val(),
        choice3: form.find('[name="choice3"]').val(),
        choice4: form.find('[name="choice4"]').val(),
        correct_choice: form.find('[name="correct_choice"]').val(),
        explanation1: form.find('[name="explanation1"]').val(),
        explanation2: form.find('[name="explanation2"]').val(),
        explanation3: form.find('[name="explanation3"]').val(),
        explanation4: form.find('[name="explanation4"]').val()
    };
}


function validateQuestionData(questionData) {
    const invalidFields = [];

    if (!questionData.date_reviewed) invalidFields.push('Date Reviewed');
    if (!questionData.question) invalidFields.push('Question');
    if (!questionData.skill) invalidFields.push('Skill');
    if (!questionData.choice1) invalidFields.push('Choice 1');
    if (!questionData.choice2) invalidFields.push('Choice 2');
    if (!questionData.choice3) invalidFields.push('Choice 3');
    if (!questionData.choice4) invalidFields.push('Choice 4');
    if (!questionData.correct_choice) invalidFields.push('Correct Choice');
    if (!questionData.explanation1) invalidFields.push('Explanation 1');
    if (!questionData.explanation2) invalidFields.push('Explanation 2');
    if (!questionData.explanation3) invalidFields.push('Explanation 3');
    if (!questionData.explanation4) invalidFields.push('Explanation 4');

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






