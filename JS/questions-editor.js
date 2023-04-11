let selectedQuestionId; // Add this line at the beginning of the script to store the selected question ID

// Fetch questions and populate the table
async function fetchQuestions() {
  try {
    const response = await fetch("https://explainit.app/api/read.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer your_api_key_here",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    console.log(data); // Add this line to check the data format
    populateTable(data);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

// Populate table with fetched questions
function populateTable(questions) {
  const tableBody = document.getElementById("questionsTableBody");
  tableBody.innerHTML = "";

  const skillColors = {
    "easy": "#c8e6c9",
    "medium": "#fff9c4",
    "hard": "#ffcdd2"
  };

  questions
    .sort((a, b) => {
      const skillOrder = ["easy", "medium", "hard"];
      const skillDiff = skillOrder.indexOf(a.skill) - skillOrder.indexOf(b.skill);
      return skillDiff !== 0 ? skillDiff : a.question.localeCompare(b.question);
    })
    .forEach(question => {
      const row = document.createElement("tr");
      row.style.backgroundColor = skillColors[question.skill];

      row.innerHTML = `
          <td>${question.id}</td>
          <td>${question.date_reviewed}</td>
          <td>${question.question}</td>
          <td>${question.skill}</td>
          <td>
              <button class="btn btn-sm btn-warning" onclick="openEditModal(${question.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${question.id})">Delete</button>
          </td>
      `;
      tableBody.appendChild(row);
    });
}

// Open Add Question Modal
function openAddModal() {
  // [Insert logic

  // Add Question
}

async function addQuestion() {
  const questionData = getAddFormData();

  // Validate the form inputs
  if (!questionData.question || !questionData.skill) {
    console.error("Question and skill are required.");
    return;
  }

  const availableChoices = questionData.choices.filter(choice => choice !== "");
  if (availableChoices.length < 2) {
    console.error("At least two choices are required.");
    return;
  }

  if (!availableChoices.includes(questionData.correct_choice)) {
    console.error("The correct choice must be one of the available choices.");
    return;
  }

  const uniqueChoices = new Set(availableChoices);
  if (uniqueChoices.size !== availableChoices.length) {
    console.error("All choices must be unique.");
    return;
  }

  const explanationsFilled = questionData.explanations.every(explanation => explanation !== "");
  if (!explanationsFilled) {
    console.error("Explanations must be filled out for all choices.");
    return;
  }

  try {
    const response = await fetch("https://explainit.app/api/create.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

        // Refresh the table and close the modal
        fetchQuestions();
        const addQuestionModal = new bootstrap.Modal(document.getElementById("addQuestionModal"));
        addQuestionModal.hide();
      } catch (error) {
        console.error("Error adding question:", error);
      }
    }
    // Call the fetchQuestions function when the page loads
fetchQuestions();

