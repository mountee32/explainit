// Fetch the starters JSON file
fetch('JSON/starters.json')
  .then(response => response.json()) // Convert the response to JSON
  .then(starters => { // Process the JSON data
    const categoriesContainer = document.getElementById('categories-container'); // Get the categories container element

    // Sort the starters by "person" alphabetically
    starters.sort((a, b) => a.person.localeCompare(b.person));

    // Loop through each category in the starters
    starters.forEach((category, index) => {
      const categoryId = `collapse${index}`;

      const accordionItem = document.createElement('div');
      accordionItem.classList.add('accordion-item');

      const accordionHeader = document.createElement('h2');
      accordionHeader.classList.add('accordion-header');

      const accordionButton = document.createElement('button');
      accordionButton.classList.add('accordion-button');
      accordionButton.setAttribute('type', 'button');
      accordionButton.setAttribute('data-bs-toggle', 'collapse');
      accordionButton.setAttribute('data-bs-target', `#${categoryId}`);
      accordionButton.setAttribute('aria-expanded', 'false');
      accordionButton.setAttribute('aria-controls', categoryId);
      accordionButton.textContent = category.person;

      accordionHeader.appendChild(accordionButton);
      accordionItem.appendChild(accordionHeader);

      const accordionCollapse = document.createElement('div');
      accordionCollapse.classList.add('accordion-collapse');
      accordionCollapse.classList.add('collapse');
      accordionCollapse.id = categoryId;
      accordionCollapse.setAttribute('data-bs-parent', '#accordionExample');

      const accordionBody = document.createElement('div');
      accordionBody.classList.add('accordion-body');

      // Loop through each question in the category
      category.questions.forEach(question => {
        const questionElement = document.createElement('div');

        const questionTitleElement = document.createElement('h4');
        questionTitleElement.textContent = `${question.title} - `;
        questionElement.appendChild(questionTitleElement);

        const answerTextElement = document.createElement('span');
        answerTextElement.textContent = question.answer;
        questionElement.appendChild(answerTextElement);

        accordionBody.appendChild(questionElement);
      });

      accordionCollapse.appendChild(accordionBody);
      accordionItem.appendChild(accordionCollapse);

      categoriesContainer.appendChild(accordionItem);
    });
  });
