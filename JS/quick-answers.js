document.addEventListener('DOMContentLoaded', function () {
    // Change the fetch URL to the API endpoint
    fetch('https://explainit.app/api/qacontentread.php')
        .then(response => response.json())
        .then(data => {
            const categoriesContainer = document.getElementById('categories-container');
            const groupedData = {};

            // Group the data by TITLE
            data.forEach(item => {
                if (!groupedData[item.TITLE]) {
                    groupedData[item.TITLE] = [];
                }
                groupedData[item.TITLE].push(item);
            });

            Object.entries(groupedData).forEach(([title, questions], index) => {
                const categoryItem = document.createElement('div');
                categoryItem.classList.add('accordion-item');

                const categoryHeader = document.createElement('h2');
                categoryHeader.classList.add('accordion-header');
                categoryHeader.setAttribute('id', `category-heading-${index}`);

                const categoryButton = document.createElement('button');
                categoryButton.classList.add('accordion-button', 'collapsed');
                categoryButton.setAttribute('type', 'button');
                categoryButton.setAttribute('data-bs-toggle', 'collapse');
                categoryButton.setAttribute('data-bs-target', `#category-collapse-${index}`);
                categoryButton.setAttribute('aria-expanded', 'false');
                categoryButton.setAttribute('aria-controls', `category-collapse-${index}`);
                categoryButton.textContent = title;

                // Append categoryButton to categoryHeader
                categoryHeader.appendChild(categoryButton);

                // Create a div for the category-collapse
                const categoryCollapse = document.createElement('div');
                categoryCollapse.classList.add('accordion-collapse', 'collapse');
                categoryCollapse.setAttribute('id', `category-collapse-${index}`);
                categoryCollapse.setAttribute('data-bs-parent', '#categories-container');

                // Create a div for the category-body
                const categoryBody = document.createElement('div');
                categoryBody.classList.add('accordion-body');

                // Create a div for the questions accordion
                const questionsAccordion = document.createElement('div');
                questionsAccordion.classList.add('accordion');
                questionsAccordion.setAttribute('id', `questions-accordion-${index}`);

                questions.forEach((questionData, questionIndex) => {
                    const questionItem = document.createElement('div');
                    questionItem.classList.add('accordion-item');

                    const questionHeader = document.createElement('h2');
                    questionHeader.classList.add('accordion-header');
                    questionHeader.setAttribute('id', `question-heading-${index}-${questionIndex}`);

                    const questionButton = document.createElement('button');
                    questionButton.classList.add('accordion-button', 'collapsed');
                    questionButton.setAttribute('type', 'button');
                    questionButton.setAttribute('data-bs-toggle', 'collapse');
                    questionButton.setAttribute('data-bs-target', `#question-collapse-${index}-${questionIndex}`);
                    questionButton.setAttribute('aria-expanded', 'false');
                    questionButton.setAttribute('aria-controls', `question-collapse-${index}-${questionIndex}`);
                    questionButton.textContent = questionData.QUESTION;

                    // Append questionButton to questionHeader
                    questionHeader.appendChild(questionButton);

                    // Create a div for the question-collapse
                    const questionCollapse = document.createElement('div');
                    questionCollapse.classList.add('accordion-collapse', 'collapse');
                    questionCollapse.setAttribute('id', `question-collapse-${index}-${questionIndex}`);
                    questionCollapse.setAttribute('data-bs-parent', `#questions-accordion-${index}`);

                    // Create a div for the question-body
                    const questionBody = document.createElement('div');
                    questionBody.classList.add('accordion-body');

                    // Create a p element for the answer text
                    const answerText = document.createElement('p');
                    answerText.textContent = questionData.ANSWER;
                    questionBody.appendChild(answerText);

                    // Create an a element for the answer link
                    const answerLink = document.createElement('a');
                    answerLink.href = questionData.LINK;
                    answerLink.textContent = 'Read more';
                    questionBody.appendChild(answerLink);

                    // Append questionBody to questionCollapse
                    questionCollapse.appendChild(questionBody);

                    // Append questionHeader and questionCollapse to questionItem
                    questionItem.appendChild(questionHeader);
                    questionItem.appendChild(questionCollapse);

                    // Append questionItem to questionsAccordion
                    questionsAccordion.appendChild(questionItem);
                });

                // Append questionsAccordion to categoryBody
                categoryBody.appendChild(questionsAccordion);

                // Append categoryBody to categoryCollapse
                categoryCollapse.appendChild(categoryBody);

                // Append categoryHeader and categoryCollapse to categoryItem
                categoryItem.appendChild(categoryHeader);
                categoryItem.appendChild(categoryCollapse);

                // Append categoryItem to categories container
                categoriesContainer.appendChild(categoryItem);
            });
        });
});
