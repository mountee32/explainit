// Global variables
const apiUrl = "https://explainit.app/api/qacategories.php";
let categories = [];

// DOM elements
const addCategoryForm = document.getElementById("categoryForm");
const editCategoryForm = document.getElementById("add-category-form");
const editCategoryIdInput = document.getElementById("edit-category-id");
const editCategoryTitleInput = document.getElementById("edit-category-title");

const categoryList = document.getElementById("categoryTableBody");


// Event listeners
window.addEventListener("load", loadCategories);
addCategoryForm.addEventListener("submit", addCategory);
editCategoryForm.addEventListener("submit", updateCategory);


async function callApi(action, data = {}) {
  const response = await fetch(API_URL + `?action=${action}`, {
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

async function getCategories() {
  const response = await callApi('read');
  return response;
}

async function addCategory(title) {
  const response = await callApi('create', { title });
  return response;
}

async function deleteCategory(id) {
  const response = await callApi('delete', { id });
  return response;
}

async function updateCategory(id, title) {
  const response = await callApi('update', { id, title });
  return response;
}

async function loginUser(username, password) {
  const response = await fetch(API_URL + '?action=login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Something went wrong');
  }

  localStorage.setItem('jwt', responseData.token);

  return responseData;
}

async function logoutUser() {
  localStorage.removeItem('jwt');
}


// Functions
function loadCategories() {
  fetch(apiUrl + "?action=read")
    .then((response) => response.json())
    .then((data) => {
      categories = data;
      displayCategories(categories);
    })
    .catch((error) => console.error(error));
}

function displayCategories(categories) {
  categoryList.innerHTML = "";
  categories.forEach((category) => {
    const row = document.createElement("tr");
    
    const titleCell = document.createElement("td");
    titleCell.innerHTML = category.title;
    row.appendChild(titleCell);
    
    const actionCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.addEventListener("click", () => editCategory(category));
    actionCell.appendChild(editButton);
    row.appendChild(actionCell);
    
    categoryList.appendChild(row);
  });
}


function addCategory(event) {
  event.preventDefault();
  const formData = getFormData(addCategoryForm);
  fetch(apiUrl + "?action=create", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      loadCategories();
    })
    .catch((error) => console.error(error));
}

function editCategory(category) {
  editCategoryIdInput.value = category.id;
  editCategoryTitleInput.value = category.title;
}

function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

function updateCategory(event) {
  event.preventDefault();
  const formData = getFormData(editCategoryForm);
  fetch(apiUrl + "?action=update", {
    method: "PUT",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      loadCategories();
    })
    .catch((error) => console.error(error));
}
function getFormData(form) {
  let data = {};
  let inputs = form.querySelectorAll("input, select, textarea");
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    let name = input.getAttribute("name");
    let value = input.value.trim();
    if (name) {
      data[name] = value;
    }
  }
  return data;
}

function resetForm(form) {
  form.reset();
  let idField = form.querySelector('[name="id"]');
  if (idField) {
    idField.value = "";
  }
}

function showMessage(message, isError = false) {
  let messageElem = document.querySelector(".message");
  messageElem.textContent = message;
  messageElem.classList.remove("error");
  messageElem.classList.remove("success");
  messageElem.classList.add(isError ? "error" : "success");
  messageElem.style.display = "block";
  setTimeout(() => {
    messageElem.style.display = "none";
  }, 3000);
}

// Event listeners
window.addEventListener("load", () => {
  getCategories();
});

document.querySelector("#categories").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-button")) {
    let id = e.target.getAttribute("data-id");
    getCategoryById(id);
  } else if (e.target.classList.contains("delete-button")) {
    let id = e.target.getAttribute("data-id");
    deleteCategory(id);
  }
});

document.querySelector("#add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let form = e.target;
  let data = getFormData(form);
  createCategory(data);
});

document.querySelector("#edit-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let form = e.target;
  let data = getFormData(form);
  updateCategory(data);
});

document.querySelector(".close-button").addEventListener("click", () => {
  hideModal();
});

document.querySelector("#modal-overlay").addEventListener("click", () => {
  hideModal();
});
