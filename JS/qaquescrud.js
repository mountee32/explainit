// Global variables
const quickAnswersApiUrl = "https://explainit.app/api/qaquestions.php";
const conversationStartersApiUrl = "https://explainit.app/api/stquestions.php";
let apiUrl = quickAnswersApiUrl;
let questions = [];
const questionModal = new bootstrap.Modal(document.getElementById('questionModal'));

// DOM elements
const addQuestionForm = document.getElementById("add-question-form");
const editQuestionForm = document.getElementById("edit-question-form");
const questionTableBody = document.getElementById("questionTableBody");
const saveQuestionBtn = document.getElementById("saveQuestionBtn");
const pageTitle = document.querySelector(".container h1");

// Event listeners
window.addEventListener("load", loadQuestions);
addQuestionForm.addEventListener("submit", addQuestion);
editQuestionForm.addEventListener("submit", updateQuestion);
saveQuestionBtn.addEventListener("click", saveQuestion);

// Toggle event listener
document.querySelectorAll('input[type=radio][name="apiToggle"]').forEach(radio => {
  radio.addEventListener('change', event => {
    apiUrl = event.target.id === "quickAnswers" ? quickAnswersApiUrl : conversationStartersApiUrl;
    pageTitle.textContent = event.target.id === "quickAnswers" ? "Quick Answers Questions" : "Conversation Starters Questions";
    loadQuestions();
  });
});

async function callApi(action, data = {}) {
  const response = await fetch(apiUrl + `?action=${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Something went wrong');
  }

  return responseData;
}

async function getQuestions() {
  const response = await callApi('read');
  return response;
}

async function addQuestion(event) {
  event.preventDefault();
  const formData = getFormData(addQuestionForm);
  const response = await callApi('create', formData);
  loadQuestions();
  questionModal.hide();
}

async function deleteQuestion(id) {
  const response = await callApi('delete', { id });
  return response;
}

async function updateQuestion(event) {
  event.preventDefault();
  const formData = getFormData(editQuestionForm);
  const response = await callApi('update', formData);
  loadQuestions();
  questionModal.hide();
}

function loadQuestions() {
  getQuestions()
    .then((data) => {
      questions = data;
      displayQuestions(questions);
    })
    .catch((error) => console.error(error));
}

function displayQuestions(questions) {
  questionTableBody.innerHTML = "";
  questions.forEach((question) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.innerHTML = question.id;
    row.appendChild(idCell);

    const categoryIDCell = document.createElement("td");
    categoryIDCell.innerHTML = question.category_id;
    row.appendChild(categoryIDCell);

    const questionCell = document.createElement("td");
    questionCell.innerHTML = question.question;
    row.appendChild(questionCell);

    const answerCell = document.createElement("td");
    answerCell.innerHTML = question.answer;
    row.appendChild(answerCell);

    const linkCell = document.createElement("td");
    linkCell.innerHTML = question.link;
    row.appendChild(linkCell);

    const actionCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.className = "btn btn-warning me-2";
    editButton.innerHTML = "Edit";
    editButton.onclick = () => editQuestionBehavior(question);
    actionCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger";
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = () => {
      deleteQuestion(question.id)
        .then(() => {
          loadQuestions();
        })
        .catch((error) => console.error(error));
    };
    actionCell.appendChild(deleteButton);

    row.appendChild(actionCell);

    questionTableBody.appendChild(row);
  });
}

function resetFormAndCreateQuestionBehavior() {
  addQuestionForm.style.display = "block";
  editQuestionForm.style.display = "none";
  addQuestionForm.reset();
}

function editQuestionBehavior(question) {
  addQuestionForm.style.display = "none";
  editQuestionForm.style.display = "block";
  questionModal.show();
  editQuestionForm.elements["id"].value = question.id;
  editQuestionForm.elements["category"].value = question.category_id;
  editQuestionForm.elements["question"].value = question.question;
  editQuestionForm.elements["answer"].value = question.answer;
  editQuestionForm.elements["link"].value = question.link;
}

function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

function saveQuestion() {
  if (addQuestionForm.style.display === "block") {
    addQuestion();
  } else {
    updateQuestion();
  }
}
