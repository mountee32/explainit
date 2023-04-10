function createEditModal() {
    const modal = `
      <div id="editQuestionModal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Question</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="editQuestionForm">
                <!-- Add form fields here -->
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" id="saveEditQuestion" class="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;
  
    document.querySelector('body').insertAdjacentHTML('beforeend', modal);
    // Add event listeners for form submission and other functionality
  }
  
  document.addEventListener('click', function (event) {
    if (event.target.matches('.editButton')) {
      const questionId = event.target.getAttribute('data-id');
      // Load the question data into the form and show the modal
      loadQuestionData(questionId);
    }
  });
  
  function loadQuestionData(questionId) {
    // Load the question data by ID from the API and populate the form
    // After populating the form, show the modal using the following line:
    // $('#editQuestionModal').modal('show');
  }
  
  // Call the createEditModal function to create the modal
  createEditModal();
  