// Global variables
const apiUrl = "https://explainit.app/api/qaquestions.php";
let questions = [];
const questionModal = new bootstrap.Modal(document.getElementById('questionModal'));

// DOM elements
const addQuestionForm = document.getElementById("add-question-form");
const editQuestionForm = document.getElementById("edit-question-form");
const questionTableBody = document.getElementById("questionTableBody");
const saveQuestionBtn = document.getElementById("saveQuestionBtn");

// Event listeners
window.addEventListener("load", loadQuestions);
addQuestionForm.addEventListener("submit", addQuestion);
editQuestionForm.addEventListener("submit", updateQuestion);


saveQuestionBtn.addEventListener("click", saveQuestion);

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
}

async function deleteQuestion(id) {
  const response = await callApi('delete', { id });
  return response;
}

async function updateQuestion(event) {
    event.preventDefault();
    const formData = getFormData(editQuestionForm);
    console.log("formData:", formData); // Add this line to log the formData
    const response = await callApi('update', formData);
    console.log("response:", response); // Add this line to log the response
    loadQuestions();
  }
  

// Functions
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
      editButton.onclick = () => editQuestion(question.id.toString());

      actionCell.appendChild(editButton);
  
      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-danger";
      deleteButton.innerHTML = "Delete";
      deleteButton.onclick = () => removeQuestion(question.id.toString());

      actionCell.appendChild(deleteButton);
  
      row.appendChild(actionCell);
  
      questionTableBody.appendChild(row);
    });
  }
  

  function editQuestion(id) {
    const question = questions.find((q) => q.id === id);
    document.getElementById("edit-question-id").value = question.id;
    document.getElementById("edit-category_id").value = question.category_id;
    document.getElementById("edit-question").value = question.question;
    document.getElementById("edit-answer").value = question.answer;
    document.getElementById("edit-link").value = question.link;
    resetFormAndEditQuestionBehavior();
  }
  

function removeQuestion(id) {
  if (confirm("Are you sure you want to delete this question?")) {
    deleteQuestion(id)
      .then(() => {
        loadQuestions();
      })
      .catch((error) => console.error(error));
  }
}

function resetFormAndCreateQuestionBehavior() {
  addQuestionForm.style.display = "block";
  editQuestionForm.style.display = "none";
  document.getElementById("questionModalLabel").innerHTML = "Add Question";
}

function resetFormAndEditQuestionBehavior() {
  addQuestionForm.style.display = "none";
  editQuestionForm.style.display = "block";
  document.getElementById("questionModalLabel").innerHTML = "Edit Question";
  $("#questionModal").modal("show");
}
function saveQuestion() {
    if (addQuestionForm.style.display === "block") {
      addQuestionForm.dispatchEvent(new Event("submit"));
    } else {
      editQuestionForm.dispatchEvent(new Event("submit"));
    }
  }
  

function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

  