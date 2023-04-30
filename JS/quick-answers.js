function typeText(element, text, delay = 50) {
    let index = 0;
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, delay);
        }
    }
    type();
}

document.addEventListener('DOMContentLoaded', function () {
    // Change the fetch URL to the new API endpoint
    fetch('https://explainit.app/api/quickanswers.php?action=read')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
            const categoriesContainer = document.getElementById('categories-container');
            const groupedData = {};

            // Group the data by category
            data.forEach(item => {
                if (!groupedData[item.category]) {
                    groupedData[item.category] = [];
                }
                groupedData[item.category].push(item);
            });

            Object.entries(groupedData).forEach(([category, questions], index) => {
                const categoryItem = document.createElement('div');
                categoryItem.classList.add('accordion-item');

                const categoryHeader = document.createElement('h2');
                categoryHeader.classList.add('accordion-header', 'category-heading');

                categoryHeader.setAttribute('id', `category-heading-${index}`);

                const categoryButton = document.createElement('button');
                categoryButton.classList.add('accordion-button', 'collapsed');
                categoryButton.setAttribute('type', 'button');
                categoryButton.setAttribute('data-bs-toggle', 'collapse');
                categoryButton.setAttribute('data-bs-target', `#category-collapse-${index}`);
                categoryButton.setAttribute('aria-expanded', 'false');
                categoryButton.setAttribute('aria-controls', `category-collapse-${index}`);
                const categoryIcon = document.createElement('i');
                categoryIcon.classList.add('bi', 'bi-chevron-right', 'category-icon');
                
                categoryButton.style.display = 'flex';
                categoryButton.style.alignItems = 'center';
                
                const categoryTextWrapper = document.createElement('span');
                categoryTextWrapper.style.display = 'inline-block';
                categoryTextWrapper.style.marginLeft = '10px';
                categoryTextWrapper.textContent = category;
                
                categoryButton.appendChild(categoryIcon);
                categoryButton.appendChild(categoryTextWrapper);
                


                // Append categoryButton to categoryHeader
                categoryHeader.appendChild(categoryButton);
                categoryButton.addEventListener('click', (event) => {
                    if (event.target === categoryButton || event.target === categoryIcon) {
                      categoryIcon.classList.toggle('rotate');
                    }
                  });
                  
                  
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
                    questionHeader.classList.add('accordion-header', 'question-heading');

                    questionHeader.setAttribute('id', `question-heading-${index}-${questionIndex}`);

                    const questionButton = document.createElement('button');
                    questionButton.classList.add('accordion-button', 'collapsed');
                    questionButton.setAttribute('type', 'button');
                    questionButton.setAttribute('data-bs-toggle', 'collapse');
                    questionButton.setAttribute('data-bs-target', `#question-collapse-${index}-${questionIndex}`);
                    questionButton.setAttribute('aria-expanded', 'false');
                    questionButton.setAttribute('aria-controls', `question-collapse-${index}-${questionIndex}`);
                    const questionIcon = document.createElement('i');
                    questionIcon.classList.add('bi', 'bi-chevron-right', 'category-icon');
                    questionButton.appendChild(questionIcon);
                    questionButton.insertAdjacentText('beforeend', questionData.question);
                    
                    // Add this event listener
                    questionButton.addEventListener('click', (event) => {
                        const currentCollapse = document.querySelector(`#question-collapse-${index}-${questionIndex}`);
                        questions.forEach((_, innerQuestionIndex) => {
                            if (innerQuestionIndex !== questionIndex) {
                                const otherCollapse = document.querySelector(`#question-collapse-${index}-${innerQuestionIndex}`);
                                const otherCollapseInstance = bootstrap.Collapse.getInstance(otherCollapse);
                                otherCollapseInstance.hide();
                            }
                        });
                    });


                    
                    // Append questionButton to questionHeader
                    questionHeader.appendChild(questionButton);
                    questionButton.addEventListener('click', (event) => {
                        if (event.target === questionButton || event.target === questionIcon) {
                          questionIcon.classList.toggle('rotate');
                        }document.addEventListener('DOMContentLoaded', function () {
                            // Change the fetch URL to the new API endpoint
                            fetch('https://explainit.app/api/quickanswers.php?action=read')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                    const categoriesContainer = document.getElementById('categories-container');
                                    const groupedData = {};
                        
                                    // Group the data by category
                                    data.forEach(item => {
                                        if (!groupedData[item.category]) {
                                            groupedData[item.category] = [];
                                        }
                                        groupedData[item.category].push(item);
                                    });
                        
                                    Object.entries(groupedData).forEach(([category, questions], index) => {
                                        const categoryItem = document.createElement('div');
                                        categoryItem.classList.add('accordion-item');
                        
                                        const categoryHeader = document.createElement('h2');
                                        categoryHeader.classList.add('accordion-header', 'category-heading');
                        
                                        categoryHeader.setAttribute('id', `category-heading-${index}`);
                        
                                        const categoryButton = document.createElement('button');
                                        categoryButton.classList.add('accordion-button', 'collapsed');
                                        categoryButton.setAttribute('type', 'button');
                                        categoryButton.setAttribute('data-bs-toggle', 'collapse');
                                        categoryButton.setAttribute('data-bs-target', `#category-collapse-${index}`);
                                        categoryButton.setAttribute('aria-expanded', 'false');
                                        categoryButton.setAttribute('aria-controls', `category-collapse-${index}`);
                                        const categoryIcon = document.createElement('i');
                                        categoryIcon.classList.add('bi', 'bi-chevron-right', 'category-icon');
                                        
                                        categoryButton.style.display = 'flex';
                                        categoryButton.style.alignItems = 'center';
                                        
                                        const categoryTextWrapper = document.createElement('span');
                                        categoryTextWrapper.style.display = 'inline-block';
                                        categoryTextWrapper.style.marginLeft = '10px';
                                        categoryTextWrapper.textContent = category;
                                        
                                        categoryButton.appendChild(categoryIcon);
                                        categoryButton.appendChild(categoryTextWrapper);
                                        
                        
                        
                                        // Append categoryButton to categoryHeader
                                        categoryHeader.appendChild(categoryButton);
                                        categoryButton.addEventListener('click', (event) => {
                                            if (event.target === categoryButton || event.target === categoryIcon) {
                                              categoryIcon.classList.toggle('rotate');
                                            }
                                          });
                                          
                                          
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
                                            questionHeader.classList.add('accordion-header', 'question-heading');
                        
                                            questionHeader.setAttribute('id', `question-heading-${index}-${questionIndex}`);
                        
                                            const questionButton = document.createElement('button');
                                            questionButton.classList.add('accordion-button', 'collapsed');
                                            questionButton.setAttribute('type', 'button');
                                            questionButton.setAttribute('data-bs-toggle', 'collapse');
                                            questionButton.setAttribute('data-bs-target', `#question-collapse-${index}-${questionIndex}`);
                                            questionButton.setAttribute('aria-expanded', 'false');
                                            questionButton.setAttribute('aria-controls', `question-collapse-${index}-${questionIndex}`);
                                            const questionIcon = document.createElement('i');
                                            questionIcon.classList.add('bi', 'bi-chevron-right', 'category-icon');
                                            questionButton.appendChild(questionIcon);
                                            questionButton.insertAdjacentText('beforeend', questionData.question);
                                            
                                            // Add this event listener
                                            questionButton.addEventListener('click', (event) => {
                                                const currentCollapse = document.querySelector(`#question-collapse-${index}-${questionIndex}`);
                                                questions.forEach((_, innerQuestionIndex) => {
                                                    if (innerQuestionIndex !== questionIndex) {
                                                        const otherCollapse = document.querySelector(`#question-collapse-${index}-${innerQuestionIndex}`);
                                                        otherCollapse.collapse('hide');
                                                    }
                                                });
                                            });
                        
                                            
                                            // Append questionButton to questionHeader
                                            questionHeader.appendChild(questionButton);
                                            questionButton.addEventListener('click', (event) => {
                                                if (event.target === questionButton || event.target === questionIcon) {
                                                  questionIcon.classList.toggle('rotate');
                                                }
                                            });
                                            
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
                                            answerText.innerHTML = questionData.answer.replace(/---/g, '<br>');
                                            questionBody.appendChild(answerText);
                        
                                            // Create a span element for the answer link
                                            const answerLinkWrapper = document.createElement('span');
                                            answerLinkWrapper.style.marginLeft = '20px';
                        
                                            // Create an a element for the answer link
                                            const answerLink = document.createElement('a');
                                            answerLink.href = questionData.link;
                                            answerLink.textContent = 'Read more';
                        
                                            // Append answerLink to answerLinkWrapper
                                            answerLinkWrapper.appendChild(answerLink);
                        
                                            // Append answerText and answerLinkWrapper to questionBody
                                            questionBody.appendChild(answerText);
                                            questionBody.appendChild(answerLinkWrapper);
                        
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
                        
                    });
                    
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
                    answerText.innerHTML = questionData.answer.replace(/---/g, '<br>');
                    questionBody.appendChild(answerText);

                    // Create a span element for the answer link
                    const answerLinkWrapper = document.createElement('span');
                    answerLinkWrapper.style.marginLeft = '20px';

                    // Create an a element for the answer link
                    const answerLink = document.createElement('a');
                    answerLink.href = questionData.link;
                    answerLink.textContent = 'Read more';

                    // Append answerLink to answerLinkWrapper
                    answerLinkWrapper.appendChild(answerLink);

                    // Append answerText and answerLinkWrapper to questionBody
                    questionBody.appendChild(answerText);
                    questionBody.appendChild(answerLinkWrapper);

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
