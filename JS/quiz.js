document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz");
  let questions = [];
  let filteredQuestions = [];
  let currentQuestionIndex = 0;
  let totalScore = 0;
  fetch("https://explainit.app/api/quiz.php?action=read")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log("Questions fetched successfully:", data);
    questions = data;
    // displayQuestionsPopup(data);
    displaySkillSelection();
  })
  .catch(error => {
    console.error("Error fetching questions:", error);
    quizContainer.innerHTML = '<h2>There was an error retrieving the quiz questions. Please try again later.</h2>';
  });


  function displayQuestionsPopup(questions) {
    const popupWindow = window.open('', 'Quiz Questions', 'height=500,width=500');
  
    const questionsList = questions.map((question, index) => `${index + 1}. ${question.question}\n`).join('');
  
    popupWindow.document.write(`<html><head><title>Quiz Questions</title></head><body><pre>${questionsList}</pre></body></html>`);
    popupWindow.document.close();
  }

  function displaySkillSelection() {
    quizContainer.innerHTML = `
      <p>Select your quiz skill level:</p>
      <button class="btn btn-outline-primary" data-skill="easy">Easy</button>
      <button class="btn btn-primary" data-skill="medium">Medium</button>
      <button class="btn btn-outline-primary" data-skill="hard">Hard</button>
      <br>
      <p>Select the number of questions:</p>
      <button class="btn btn-primary" data-questions="5" id="question-5">5</button>
      <button class="btn btn-outline-primary" data-questions="10" id="question-10">10</button>
      <button class="btn btn-outline-primary" data-questions="15" id="question-15">15</button>
      <br>
      <button class="btn btn-success mt-3" id="start-quiz">Start Quiz</button>
    `;
  
    const skillButtons = quizContainer.querySelectorAll("[data-skill]");
    const questionButtons = quizContainer.querySelectorAll("[data-questions]");
    let selectedSkill = "medium"; // Default skill level
    let selectedNumberOfQuestions = 5; // Default number of questions
  
    skillButtons.forEach(button => {
      button.addEventListener("click", () => {
        selectedSkill = button.dataset.skill;
        skillButtons.forEach(btn => {
          btn.classList.remove("btn-primary");
          btn.classList.add("btn-outline-primary");
        });
        button.classList.remove("btn-outline-primary");
        button.classList.add("btn-primary");
      });
    });
  
    questionButtons.forEach(button => {
      button.addEventListener("click", () => {
        selectedNumberOfQuestions = parseInt(button.dataset.questions, 10);
        questionButtons.forEach(btn => {
          btn.classList.remove("btn-primary");
          btn.classList.add("btn-outline-primary");
        });
        button.classList.remove("btn-outline-primary");
        button.classList.add("btn-primary");
      });
    });
  
    document.getElementById("start-quiz").addEventListener("click", () => {
      filteredQuestions = filterQuestionsBySkill(selectedSkill, selectedNumberOfQuestions);
      if (filteredQuestions.length > 0) {
        displayQuestion(filteredQuestions[currentQuestionIndex]);
      } else {
        quizContainer.innerHTML = '<h2>No questions found for selected skill level and number of questions.</h2>';
      }
    });
  }

  function filterQuestionsBySkill(skill, numberOfQuestions) {
    const skillQuestions = questions.filter(question => question.skill === skill);
    return skillQuestions.sort(() => 0.5 - Math.random()).slice(0, numberOfQuestions);
  }

  function displayQuestion(question) {
    quizContainer.innerHTML = `
    <h2 class="question-number">Question ${currentQuestionIndex + 1} of ${filteredQuestions.length}</h2>
  
      <quiz-question>${question.question}</quiz-question>
      <div class="choices">
        ${["choice1", "choice2", "choice3", "choice4"].map((choiceKey, index) => `
          <button class="btn btn-outline-primary" data-choice="${index}">${question[choiceKey]}</button>
        `).join("")}
      </div>
      <div class="explanation mt-3" style="display: none;"></div>
      <button class="btn btn-success mt-3" id="next-question" style="display: none;">Next Question</button> `;
    const choiceButtons = quizContainer.querySelectorAll("[data-choice]");
  
    choiceButtons.forEach(button => {
      button.addEventListener("click", () => {
        const answerIndex = parseInt(button.dataset.choice, 10);
        const correctIndex = parseInt(question.correct_choice, 10);
        displayExplanation(question, answerIndex, correctIndex);
  
        // Disable all choice buttons after an answer has been selected
        choiceButtons.forEach(btn => {
          btn.setAttribute("disabled", "disabled");
        });
      });
    });
  }
  

  function displayExplanation(question, answerIndex, correctIndex) {
    const explanation = quizContainer.querySelector(".explanation");
    const choiceButtons = quizContainer.querySelectorAll("[data-choice]");
  
    // Highlight the correct and wrong answers
    choiceButtons.forEach((button, index) => {
      const isCorrect = index === correctIndex;
      const isChosen = index === answerIndex;
  
      if (isCorrect) {
        button.classList.add("btn-success");
        button.classList.remove("btn-outline-primary");
      } else {
        button.classList.add("btn-danger");
        button.classList.remove("btn-outline-primary");
      }
  
      if (isChosen) {
        button.disabled = true;
      } else {
        button.disabled = true;
      }
    });
  
    let icon;
    let answerText;
    if (answerIndex === correctIndex) {
      totalScore++;
      icon = '<i class="fas fa-check-circle animated-icon correct"></i>';
      answerText = "";
       answerText = "Correct,";
    } else {
      icon = '<i class="fas fa-times-circle animated-icon wrong"></i>';
      answerText = "";
       answerText = "Wrong, ";
    }
  
    explanation.innerHTML = `${icon} ${answerText} ${question[`explanation${correctIndex + 1}`]}`;
  
    explanation.style.display = "block";
  
    const nextButton = document.getElementById("next-question");
    nextButton.style.display = "block";
    nextButton.addEventListener("click", () => {
      currentQuestionIndex++;
  
      if (currentQuestionIndex < filteredQuestions.length) {
        displayQuestion(filteredQuestions[currentQuestionIndex]);
      } else {
        displayResults();
      }
    });
  }
  
  

function displayResults() {
  quizContainer.innerHTML = `<h2>Quiz Summary</h2> <p>Your total score: ${totalScore} out of ${filteredQuestions.length}</p> <button class="btn btn-primary" id="start-again">Start Again</button>`;
  document.getElementById("start-again").addEventListener("click", () => {
    totalScore = 0;
    currentQuestionIndex = 0;
    displaySkillSelection();
  });
}




});