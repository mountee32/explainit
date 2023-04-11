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
    const choices = [
        document.getElementById("editChoice1").value,
        document.getElementById("editChoice2").value,
        document.getElementById("editChoice3").value,
        document.getElementById("editChoice4").value,
    ];
    const correct_choice = document.querySelector('input[name="editCorrectChoice"]:checked').value;
    const explanations = [
        document.getElementById("editExplanation1").value,
        document.getElementById("editExplanation2").value,
        document.getElementById("editExplanation3").value,
        document.getElementById("editExplanation4").value,
    ];

    return {
        id: parseInt(document.getElementById("editQuestionId").value),
        date_reviewed: new Date().toISOString().slice(0, 10),
        question,
        skill,
        choice1: choices[0],
        choice2: choices[1],
        choice3: choices[2],
        choice4: choices[3],
        correct_choice: parseInt(correct_choice),
        explanation1: explanations[0],
        explanation2: explanations[1],
        explanation3: explanations[2],
        explanation4: explanations[3],
    };
}
  
  // Set the values in the edit form inputs
  function setEditFormData(questionData) {
    document.getElementById("editQuestionId").value = questionData.id;
    document.getElementById("editQuestion").value = questionData.question;
    document.getElementById("editSkill").value = questionData.skill;
    document.getElementById("editChoice1").value = questionData.choice1;
    document.getElementById("editChoice2").value = questionData.choice2;
    document.getElementById("editChoice3").value = questionData.choice3;
    document.getElementById("editChoice4").value = questionData.choice4;
    document.querySelector(`input[name="editCorrectChoice"][value="${questionData.correct_choice}"]`).checked = true;
    document.getElementById("editExplanation1").value = questionData.explanation1;
    document.getElementById("editExplanation2").value = questionData.explanation2;
    document.getElementById("editExplanation3").value = questionData.explanation3;
    document.getElementById("editExplanation4").value = questionData.explanation4;
}
    
   
  function getEditFormData() {
    const question = document.getElementById("editQuestion").value;
    const skill = document.getElementById("editSkill").value;
    const choices = [
      document.getElementById("editChoice1").value,
      document.getElementById("editChoice2").value,
      document.getElementById("editChoice3").value,
      document.getElementById("editChoice4").value,
    ];
    const correct_choice = document.querySelector('input[name="editCorrectChoice"]:checked').value;
    const explanations = [
      document.getElementById("editExplanation1").value,
      document.getElementById("editExplanation2").value,
      document.getElementById("editExplanation3").value,
      document.getElementById("editExplanation4").value,
    ];
    
    return {
      id: parseInt(document.getElementById("editQuestionId").value),
      date_reviewed: new Date().toISOString().slice(0, 10),
      question,
      skill,
      choice1: choices[0],
      choice2: choices[1],
      choice3: choices[2],
      choice4: choices[3],
      correct_choice: parseInt(correct_choice),
      explanation1: explanations[0],
      explanation2: explanations[1],
      explanation3: explanations[2],
      explanation4: explanations[3],
    };
  }
  
  function setEditFormData(questionData) {
    document.getElementById("editQuestionId").value = questionData.id;
    document.getElementById("editQuestion").value = questionData.question;
    document.getElementById("editSkill").value = questionData.skill;
    document.getElementById("editChoice1").value = questionData.choice1;
    document.getElementById("editChoice2").value = questionData.choice2;
    document.getElementById("editChoice3").value = questionData.choice3;
    document.getElementById("editChoice4").value = questionData.choice4;
    document.querySelector(`input[name="editCorrectChoice"][value="${questionData.correct_choice}"]`).checked = true;
    document.getElementById("editExplanation1").value = questionData.explanation1;
    document.getElementById("editExplanation2").value = questionData.explanation2;
    document.getElementById("editExplanation3").value = questionData.explanation3;
    document.getElementById("editExplanation4").value = questionData.explanation4;
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
    
   

// Call the fetchQuestions function when the page loads
fetchQuestions();
