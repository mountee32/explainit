const tableSelect = document.getElementById("tableSelect");
const searchInput = document.getElementById("searchInput");
const headerRow = document.getElementById("headerRow");
const tableBody = document.getElementById("tableBody");

let selectedTable = null;

tableSelect.addEventListener("change", (event) => {
  selectedTable = event.target.value;
  fetchData(selectedTable);
});

searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.trim().toLowerCase();
  filterData(searchTerm);
});

function fetchData(table) {
  const api = getAPI(table);
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous data
      headerRow.innerHTML = "";
      tableBody.innerHTML = "";

      // Add table headers
      const fields = data[0].fields;
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const th = document.createElement("th");
        th.setAttribute("scope", "col");
        th.textContent = field.name;
        headerRow.appendChild(th);
      }

      // Add table data
      for (let i = 0; i < data.length; i++) {
        const record = data[i];
        const tr = document.createElement("tr");

        for (let j = 0; j < fields.length; j++) {
          const field = fields[j];
          const td = document.createElement("td");
          td.textContent = record[field.name];
          tr.appendChild(td);
        }

        tableBody.appendChild(tr);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function filterData(searchTerm) {
  const rows = table
        // Add table body to table element
        table.appendChild(tableBody);

        // Add table to container div
        container.appendChild(table);

        // Append container div to main element
        main.appendChild(container);

        // Add event listeners to table select and search input
        tableSelect.addEventListener('change', function () {
            currentTable = this.value;
            getRecords();
        });

        searchInput.addEventListener('input', function () {
            searchTerm = this.value;
            getRecords();
        });

        // Call getRecords function to initially populate table
        getRecords();
    }

    // Call init function to set up table
    init();
})();
