import requests
import json
import logging
import random

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

# Define a function to create a new random question using the API
def create_question():
    logging.info("I'm now creating one question...")
    new_question = {
        "question": "What is the capital of " + random.choice(["France", "Spain", "Italy"]) + "?",
        "skill": random.choice(["easy", "medium", "hard"]),
        "choice1": random.choice(["Paris", "Madrid", "Rome"]),
        "choice2": random.choice(["London", "Barcelona", "Milan"]),
        "choice3": random.choice(["Berlin", "Seville", "Naples"]),
        "choice4": random.choice(["Lisbon", "Valencia", "Turin"]),
        "correct_choice": random.randint(1, 4),
        "explanation1": "Explanation 1",
        "explanation2": "Explanation 2",
        "explanation3": "Explanation 3",
        "explanation4": "Explanation 4"
    }
    logging.info("Sending payload: " + str(new_question))
    try:
        response = requests.post(CREATE_API_URL, json=new_question)
        if response.status_code == 200:
            logging.info("New question created successfully.")
        else:
            logging.error("Error: Failed to create new question using the API. Status code: " + str(response.status_code) + " Response text: " + response.text)
    except Exception as e:
        logging.error("Error: " + str(e))

    logging.info("Finished creating one question.")


# Call the read_all_questions function to log all questions
read_all_questions()

# Call the read_one_question function to log the first question by ID
if example_id is not None:
    read_one_question(example_id)
else:
    logging.error("Error: example_id variable is None.")

# Call the create_question function to create a new random question using the API
create_question()
