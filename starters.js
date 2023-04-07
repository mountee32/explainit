// Fetch the starters JSON file
fetch('starters.json')
  .then(response => response.json()) // Convert the response to JSON
  .then(starters => { // Process the JSON data
    const categoriesContainer = document.getElementById('categories-container'); // Get the categories container element

    // Sort the starters by "person" alphabetically
    starters.sort((a, b) => a.person.localeCompare(b.person));

    // Loop through each category in the starters
    starters.forEach(category => {
      const categoryElement = document.createElement('div'); // Create a new category element
      categoryElement.classList.add('category'); // Add the 'category' class to the new element

      const categoryTitleElement = document.createElement('h3'); // Create a new category title element
      categoryTitleElement.textContent = category.person; // Set the category title text
      categoryElement.appendChild(categoryTitleElement); // Append the title element to the category element

      const questionsContainerElement = document.createElement('div'); // Create a new questions container element
      questionsContainerElement.classList.add('questions-container'); // Add the 'questions-container' class to the new element

      // Loop through each question in the category
      category.questions.forEach(question => {
        const questionElement = document.createElement('div'); // Create a new question element
        questionElement.classList.add('question'); // Add the 'question' class to the new element

        const questionTitleElement = document.createElement('h4'); // Create a new question title element
        questionTitleElement.textContent = `${question.title} - `; // Set the question title text
        questionElement.appendChild(questionTitleElement); // Append the title element to the question element

        const answerTextElement = document.createElement('span'); // Create a new answer text element
        answerTextElement.textContent = question.answer; // Set the answer text
        answerTextElement.style.display = 'inline'; // Display the answer text inline
        questionElement.appendChild(answerTextElement); // Append the answer text element to the question element

        // Removed click event listener

        questionsContainerElement.appendChild(questionElement); // Append the question element to the questions container element
      });

      categoryElement.appendChild(questionsContainerElement); // Append the questions container element to the category element

      categoriesContainer.appendChild(categoryElement); // Append the category element to the categories container

      // Add event listener to category title
      categoryTitleElement.addEventListener("click", () => {
        const questionsContainer = categoryTitleElement.parentElement.querySelector(
          ".questions-container"
        );
        const isOpen = questionsContainer.style.display === "flex";
        questionsContainer.style.display = isOpen ? "none" : "flex";

        // Close other open categories
        const otherQuestionsContainers = Array.from(
          categoryTitleElement.parentElement.parentElement.getElementsByClassName(
            "questions-container"
          )
        );
        otherQuestionsContainers.forEach((otherQuestionsContainer) => {
          if (otherQuestionsContainer !== questionsContainer) {
            otherQuestionsContainer.style.display = "none";
          }
        });
      });
    });
  });
