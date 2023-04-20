// Global variables
const apiUrl = "https://explainit.app/api/qacategories.php";
let categories = [];

// DOM elements
const addCategoryForm = document.getElementById("add-category-form");
const editCategoryForm = document.getElementById("edit-category-form");
const categoryTableBody = document.getElementById("categoryTableBody");
const saveCategoryBtn = document.getElementById("saveCategoryBtn");

// Event listeners
window.addEventListener("load", loadCategories);
addCategoryForm.addEventListener("submit", addCategory);
editCategoryForm.addEventListener("submit", updateCategory);
saveCategoryBtn.addEventListener("click", saveCategory);

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

async function getCategories() {
  const response = await callApi('read');
  return response;
}

async function addCategory(event) {
  event.preventDefault();
  const formData = getFormData(addCategoryForm);
  const response = await callApi('create', formData);
  loadCategories();
}

async function deleteCategory(id) {
  const response = await callApi('delete', { id });
  return response;
}

async function updateCategory(event) {
  event.preventDefault();
  const formData = getFormData(editCategoryForm);
  const response = await callApi('update', formData);
  loadCategories();
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
  categoryTableBody.innerHTML = "";
  categories.forEach((category) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.innerHTML = category.id;
    row.appendChild(idCell);

    const titleCell = document.createElement("td");
    titleCell.innerHTML = category.title;
    row.appendChild(titleCell);

    const actionCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.className = "btn btn-warning me-2";
    editButton.innerHTML = "Edit";
    editButton.onclick = () => editCategory(category.id);
    actionCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger";
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = () => removeCategory(category.id);
    actionCell.appendChild(deleteButton);

    row.appendChild(actionCell);

    categoryTableBody.appendChild(row);
  });
}

function editCategory(id) {
  const category = categories.find((cat) => cat.id === id);
  document.getElementById("edit-category-id").value = category.id;
  document.getElementById("edit-category-title").value = category.title;
  resetFormAndEditCategoryBehavior();
}

function removeCategory(id) {
  if (confirm("Are you sure you want to delete this category?")) {
    deleteCategory(id)
      .then(() => {
        loadCategories();
      })
      .catch((error) => console.error(error));
  }
}

function resetFormAndCreateCategoryBehavior() {
  addCategoryForm.style.display = "block";
  editCategoryForm.style.display = "none";
  document.getElementById("categoryModalLabel").innerHTML = "Add Category";
}

function resetFormAndEditCategoryBehavior() {
  addCategoryForm.style.display = "none";
  editCategoryForm.style.display = "block";
  document.getElementById("categoryModalLabel").innerHTML = "Edit Category";
  $("#categoryModal").modal("show");
}

function saveCategory() {
  const form = addCategoryForm.style.display === "block" ? addCategoryForm : editCategoryForm;
  form.dispatchEvent(new Event("submit"));
}

function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return data;
}
function submitForm() {
  const addForm = document.getElementById('add-category-form');
  const editForm = document.getElementById('edit-category-form');
  if (addForm.style.display !== 'none') {
    addForm.dispatchEvent(new Event('submit'));
  } else {
    editForm.dispatchEvent(new Event('submit'));
  }
}
