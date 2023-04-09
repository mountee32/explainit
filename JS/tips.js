// Fetch the tips JSON file
fetch('tips.json')
  .then(response => response.json()) // Convert the response to JSON
  .then(tips => { // Process the JSON data
    const tipsAccordion = document.getElementById('tips-accordion'); // Get the accordion element

    // Loop through each tip in the tips
    tips.forEach((tip, index) => {
      const tipId = `collapse${index}`;

      const accordionItem = document.createElement('div');
      accordionItem.classList.add('accordion-item');

      const accordionHeader = document.createElement('h2');
      accordionHeader.classList.add('accordion-header');

      const accordionButton = document.createElement('button');
      accordionButton.classList.add('accordion-button');
      accordionButton.setAttribute('type', 'button');
      accordionButton.setAttribute('data-bs-toggle', 'collapse');
      accordionButton.setAttribute('data-bs-target', `#${tipId}`);
      accordionButton.setAttribute('aria-expanded', 'false');
      accordionButton.setAttribute('aria-controls', tipId);
      accordionButton.textContent = tip["Section Heading"];

      accordionHeader.appendChild(accordionButton);
      accordionItem.appendChild(accordionHeader);

      const accordionCollapse = document.createElement('div');
      accordionCollapse.classList.add('accordion-collapse');
      accordionCollapse.classList.add('collapse');
      accordionCollapse.id = tipId;
      accordionCollapse.setAttribute('data-bs-parent', '#tips-accordion');

      const accordionBody = document.createElement('div');
      accordionBody.classList.add('accordion-body');
      accordionBody.textContent = tip.Content;

      accordionCollapse.appendChild(accordionBody);
      accordionItem.appendChild(accordionCollapse);

      tipsAccordion.appendChild(accordionItem);
    });
  });
