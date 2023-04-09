document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz");
  let questions = [];
  let filteredQuestions = [];
  let currentQuestionIndex = 0;
  let totalScore = 0;

  fetch("JSON/questions.json")
    .then(response => response.json())
    .then(data => {
      questions = data;
      displaySkillSelection();
    });

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
        displayQuestion(filteredQuestions[currentQuestionIndex]);
      });
    }
    
    
    

    function filterQuestionsBySkill(skill, numberOfQuestions) {
      const skillQuestions = questions.filter(question => question.skill === skill);
      return skillQuestions.sort(() => 0.5 - Math.random()).slice(0, numberOfQuestions);
    }
    
  function displayQuestion(question) {
    quizContainer.innerHTML = `
    <h2>Question ${currentQuestionIndex + 1} of ${filteredQuestions.length}</h2>
    <quiz-question>${question.question}</quiz-question>
    <div class="choices">
      ${question.choices.map((choice, index) => `
        <button class="btn btn-outline-primary" data-choice="${index}">${choice}</button>
      `).join("")}
    </div>
    <div class="explanation mt-3" style="display: none;"></div>
    <button class="btn btn-success mt-3" id="next-question" style="display: none;">Next Question</button>
  `;
  
    const choiceButtons = quizContainer.querySelectorAll("[data-choice]");
  
    choiceButtons.forEach(button => {
      button.addEventListener("click", () => {
        const answerIndex = parseInt(button.dataset.choice, 10);
        const correctIndex = question.correct;
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
    if (answerIndex === correctIndex) {
      totalScore++;
      icon = '<i class="fas fa-check-circle animated-icon correct"></i>';
    } else {
      icon = '<i class="fas fa-times-circle animated-icon wrong"></i>';
    }
  
    explanation.innerHTML = `${icon} ${question.explanations[answerIndex]}`;
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
    quizContainer.innerHTML = `
      <h2>Quiz Summary</h2>
      <p>Your total score: ${totalScore} out of ${filteredQuestions.length}</p>
      <button class="btn btn-primary" id="start-again">Start Again</button>
    `;

    document.getElementById("start-again").addEventListener("click", () => {
      totalScore = 0;
      currentQuestionIndex = 0;
      displaySkillSelection();
    });
  }
});
