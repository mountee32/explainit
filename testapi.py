import requests
import json
import logging
import random
import test_create_question

# Set up logging to both console and file
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s [%(levelname)s] %(message)s', handlers=[logging.FileHandler("testapi.log"), logging.StreamHandler()])

# Define the API URLs
READ_API_URL = "http://explainit.app/api/read.php"
CREATE_API_URL = "http://explainit.app/api/create.php"

# Define a variable to store the ID of the first question
example_id = None

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

def edit_question():
    logging.info("I'm now editing a question...")
    question_id = 18390
    edit_question_url = "http://explainit.app/api/update.php"

    edited_question = {
        "id": question_id,
        "question": "_What is the capital of France?",
        "skill": "easy",
        "choices": ["Paris", "Barcelona", "Berlin", "Valencia"],
        "correct": 1,
        "explanations": [
            "It's the capital city of France",
            "It's known for the Eiffel Tower",
            "It's also called the City of Light",
            "It's a major center for art and fashion"
        ]
    }

    try:
        response = requests.put(edit_question_url, json=edited_question)
        if response.status_code == 200:
            logging.info("Question edited successfully.")
        else:
            logging.error("Error: Failed to edit question using the API. Status code: " + str(response.status_code) + " Response text: " + response.text)
    except Exception as e:
        logging.error("Error: " + str(e))

    logging.info("Finished editing a question.")

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
edit_question()
