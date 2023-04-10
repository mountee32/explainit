// Fetch questions and populate the table
async function fetchQuestions() {
    try {
        const response = await fetch("explainit.app/api/read.php", {
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
  
    questions
      .sort((a, b) => {
        const skillOrder = ["easy", "medium", "hard"];
        const skillDiff = skillOrder.indexOf(a.skill) - skillOrder.indexOf(b.skill);
        return skillDiff !== 0 ? skillDiff : a.question.localeCompare(b.question);
      })
      .forEach(question => {
        const row = document.createElement("tr");
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
    // [Insert logic to get the form data]
    
    try {
      const response = await fetch("explainit.app/api/create.php", {
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
    
    // Open Edit Question Modal
    async function openEditModal(id) {
      // [Insert logic to populate the form with the selected question data]
    
      const editQuestionModal = new bootstrap.Modal(document.getElementById("editQuestionModal"));
      editQuestionModal.show();
    }
    
    // Update Question
    async function updateQuestion() {
      // [Insert logic to get the form data]
    
      try {
        const response = await fetch("explainit.app/api/update.php", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer your_api_key_here",
          },
          body: JSON.stringify(questionData),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
    
        // Refresh the table and close the modal
        fetchQuestions();
        const editQuestionModal = new bootstrap.Modal(document.getElementById("editQuestionModal"));
        editQuestionModal.hide();
      } catch (error) {
        console.error("Error updating question:", error);
      }
    }
    
    // Open Delete Question Modal
    function openDeleteModal(id) {
      // [Insert logic to store the selected question ID for deletion]
    
      const deleteQuestionModal = new bootstrap.Modal(document.getElementById("deleteQuestionModal"));
      deleteQuestionModal.show();
    }
    
    // Delete Question
    async function deleteQuestion() {
      // [Insert logic to get the stored question ID]
    
      try {
        const response = await fetch("explainit.app/api/delete.php", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer your_api_key_here",
          },
          body: JSON.stringify({ id }),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
    
        // Refresh the table and close the modal
        fetchQuestions();
        const deleteQuestionModal = new bootstrap.Modal(document.getElementById("deleteQuestionModal"));
        deleteQuestionModal.hide();
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
    
    

    

function getEditFormData() {
    const question = document.getElementById("editQuestion").value;
    const skill = document.getElementById("editSkill").value;
    // [Get the values for choices, correct choice, and explanations]

    return {
        question: question,
        skill: skill,
        // [Add the remaining properties like choices, correct choice, and explanations]
    };
}

function setEditFormData(questionData) {
    document.getElementById("editQuestionId").value = questionData.id;
    document.getElementById("editQuestion").value = questionData.question;
    document.getElementById("editSkill").value = questionData.skill;
    // [Set the values for choices, correct choice, and explanations]
}



// Call the fetchQuestions function when the page loads
fetchQuestions();
