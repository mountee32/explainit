import requests
import json
import logging
import random
import python.old.test_create_question as test_create_question
import python.old.test_update_question as test_update_question


# Set up logging to both console and file
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s [%(levelname)s] %(message)s', handlers=[logging.FileHandler("testapi.log"), logging.StreamHandler()])

# Define the API URLs
READ_API_URL = "https://ai4christians.com/api/read.php"
CREATE_API_URL = "https://ai4christians.com/api/create.php"
DELETE_API_URL = "https://ai4christians.com/api/delete.php"

# Define a variable to store the ID of the first question
example_id = None

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
}

# Define a function to read all questions from the API and log them
def read_all_questions():
    logging.info("I'm now reading all questions...")
    try:
        response = requests.get(READ_API_URL)
        if response.status_code == 200:
            data = json.loads(response.text)
            for question in data:
                logging.info(json.dumps(question, indent=4))
            # Store the ID of the first question in the example_id variable
            global example_id
            example_id = data[0]["id"]
        else:
            logging.error("Error: Failed to read questions from the API.")
    except Exception as e:
        logging.error("Error: " + str(e))

    logging.info("Finished reading all questions.")

# Define a function to read a single question from the API and log it
def read_one_question(id):
    logging.info("I'm now reading one question...")
    try:
        response = requests.get(READ_API_URL + "?id=" + str(id))
        if response.status_code == 200:
            data = json.loads(response.text)
            logging.info(json.dumps(data, indent=4))
        else:
            logging.error("Error: Failed to read question from the API.")
    except Exception as e:
        logging.error("Error: " + str(e))

    logging.info("Finished reading one question.")


# Call the read_all_questions function to log all questions
read_all_questions()

# Call the read_one_question function to log the first question by ID
if example_id is not None:
    read_one_question(example_id)
else:
    logging.error("Error: example_id variable is None.")

# Call the create_question function to create a new question using the API
test_create_question.create_question()

# Call the edit_question function to edit a question using the API
test_update_question.update_question()

# Define a function to delete a question from the API using a specific ID
def delete_question():
    logging.info("I'm now deleting questions...")
    try:
        # Read all questions
        response = requests.get(READ_API_URL)
        if response.status_code == 200:
            data = json.loads(response.text)
            # Loop through all questions and delete any where the first character is _
            for question in data:
                if question["question"][0] == "_":
                    logging.info("Deleting question with ID " + str(question["id"]) + " and content: " + question["question"] + "...")
                    delete_data = {"id": question["id"]}
                    logging.info("API call: " + DELETE_API_URL + ", data: " + json.dumps(delete_data))

                    delete_response = requests.delete(DELETE_API_URL, data=json.dumps(delete_data))
                    if delete_response.status_code == 200:
                        logging.info("Question deleted successfully.")
                    else:
                        logging.error("Error: Failed to delete question from the API.")
                else:
                    logging.info("Skipping question with ID " + str(question["id"]) + " and content: " + question["question"] + ".")
        else:
            logging.error("Error: Failed to read questions from the API.")
    except Exception as e:
        logging.error("Error: " + str(e))

    logging.info("Finished deleting questions.")


# Call the delete_question function to delete any question starting with underscore _
delete_question()
