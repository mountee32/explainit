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
    return questionData.date_reviewed && questionData.question && questionData.skill
           && questionData.choice1 && questionData.choice2 && questionData.choice3
           && questionData.choice4 && questionData.correct_choice
           && questionData.explanation1 && questionData.explanation2
           && questionData.explanation3 && questionData.explanation4;
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






