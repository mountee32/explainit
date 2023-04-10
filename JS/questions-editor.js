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


    
// Call this function to open the edit modal for a question with a given ID
async function openEditModal(id) {
    try {
      const response = await fetch(`https://explainit.app/api/read.php?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer your_api_key_here",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const questionData = await response.json();
      setEditFormData(questionData);
  
      const editQuestionModal = new bootstrap.Modal(document.getElementById("editQuestionModal"));
      editQuestionModal.show();
    } catch (error) {
      console.error("Error opening edit modal:", error);
    }
  }
  
  
  // Get the values from the edit form inputs
  function getEditFormData() {
    const question = document.getElementById("editQuestion").value;
    const skill = document.getElementById("editSkill").value;
    const choices = [];
    const explanations = [];
  
    // Get the values for choices and explanations
    for (let i = 1; i <= 4; i++) {
      choices.push(document.getElementById(`editChoice${i}`).value);
      explanations.push(document.getElementById(`editExplanation${i}`).value);
    }
  
    const correct_choice = document.querySelector('input[name="editCorrectChoice"]:checked').value;
  
    return {
      question,
      skill,
      choices,
      correct_choice,
      explanations,
    };
  }
  
  // Set the values in the edit form inputs
  function setEditFormData(questionData) {
    document.getElementById("editQuestionId").value = questionData.id;
    document.getElementById("editQuestion").value = questionData.question;
    document.getElementById("editSkill").value = questionData.skill;
  
    // Set the values for choices and explanations
    for (let i = 1; i <= 4; i++) {
      document.getElementById(`editChoice${i}`).value = questionData.choices[i - 1];
      document.getElementById(`editExplanation${i}`).value = questionData.explanations[i - 1];
    }
  
    // Set the value for correct_choice
    const correctChoiceRadios = document.getElementsByName("editCorrectChoice");
    for (let i = 0; i < correctChoiceRadios.length; i++) {
      if (correctChoiceRadios[i].value === questionData.correct_choice) {
        correctChoiceRadios[i].checked = true;
      }
    }
  }
  
  
  function getEditFormData() {
    const question = document.getElementById("editQuestion").value;
    const skill = document.getElementById("editSkill").value;
    const choices = [];
    const explanations = [];
  
    for (let i = 1; i <= 4; i++) {
      choices.push(document.getElementById(`editChoice${i}`).value);
      explanations.push(document.getElementById(`editExplanation${i}`).value);
    }
  
    const correct_choice = document.querySelector('input[name="editCorrectChoice"]:checked').value;
  
    return {
      id: parseInt(document.getElementById("editQuestionId").value),
      question,
      skill,
      choices,
      correct: parseInt(correct_choice),
      explanations,
    };
  }
  
  
  function setEditFormData(questionData) {
    document.getElementById("editQuestionId").value = questionData.id;
    document.getElementById("editQuestion").value = questionData.question;
    document.getElementById("editSkill").value = questionData.skill;
    document.getElementById(`editChoice1`).value = questionData.choices[0];
    document.getElementById(`editChoice2`).value = questionData.choices[1];
    document.getElementById(`editChoice3`).value = questionData.choices[2];
    document.getElementById(`editChoice4`).value = questionData.choices[3];
    document.getElementById(`editExplanation1`).value = questionData.explanations[0];
    document.getElementById(`editExplanation2`).value = questionData.explanations[1];
    document.getElementById(`editExplanation3`).value = questionData.explanations[2];
    document.getElementById(`editExplanation4`).value = questionData.explanations[3];
    document.querySelector(`input[name="editCorrectChoice"][value="${questionData.correct_choice}"]`).checked = true;
  }
  
  
    
// Update Question
async function updateQuestion() {
    const questionData = getEditFormData();
  
    try {
      const response = await fetch("https://explainit.app/api/update.php", {
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
        const response = await fetch("https://explainit.app/api/delete.php", {
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
