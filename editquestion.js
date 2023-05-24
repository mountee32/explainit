function openEditModal(id) {
    loadQuestionData(id);
    $('#editQuestionModal').modal('show');
  }
  
  function loadQuestionData(id) {
    $.ajax({
      url: 'https://ai4christians.com/api/read.php',
      type: 'GET',
      headers: {
        'Authorization': 'Bearer 55556666'
      },
      success: function (response) {
        const question = response.find(q => q.id == id);
        if (question) {
          $('#questionId').val(question.id);
          $('#questionInput').val(question.question);
          $('#skillInput').val(question.skill);
          $('#choice1Input').val(question.choices[0]);
          $('#choice2Input').val(question.choices[1]);
          $('#choice3Input').val(question.choices[2]);
          $('#choice4Input').val(question.choices[3]);
          $('#correctChoiceInput').val(question.correct);
          $('#explanation1Input').val(question.explanations[0]);
          $('#explanation2Input').val(question.explanations[1]);
          $('#explanation3Input').val(question.explanations[2]);
          $('#explanation4Input').val(question.explanations[3]);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
        alert('Unable to load question data.');
      }
    });
  }
  
  function saveQuestion() {
    const id = $('#questionId').val();
    const question = $('#questionInput').val();
    const skill = $('#skillInput').val();
    const choice1 = $('#choice1Input').val();
    const choice2 = $('#choice2Input').val();
    const choice3 = $('#choice3Input').val();
    const choice4 = $('#choice4Input').val();
    const correct_choice = $('#correctChoiceInput').val();
    const explanation1 = $('#explanation1Input').val();
    const explanation2 = $('#explanation2Input').val();
    const explanation3 = $('#explanation3Input').val();
    const explanation4 = $('#explanation4Input').val();
  
    const questionData = {
      id: id,
      question: question,
      skill: skill,
      choices: [choice1, choice2, choice3, choice4],
      correct: correct_choice,
      explanations: [explanation1, explanation2, explanation3, explanation4]
    };
  
    $.ajax({
      url: 'https://ai4christians.com/api/update.php',
      type: 'PUT',
      headers: {
        'Authorization': 'Bearer Jump857571111',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(questionData),
      success: function (response) {
        console.log(response);
        alert('Question updated successfully.');
        $('#editQuestionModal').modal('hide');
        loadQuestions();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
        alert('Unable to update question.');
      }
    });
  }
  