import requests
import json
import random

# Define the API URLs
READ_API_URL = "http://explainit.app/api/read.php"
ADD_API_URL = "http://explainit.app/api/add.php"

# Define a function to read all questions from the API and print them to the console
def read_questions():
    response = requests.get(READ_API_URL)
    if response.status_code == 200:
        data = json.loads(response.text)
        for question in data:
            print(json.dumps(question, indent=4))
    else:
        print("Error: Failed to read questions from the API.")

# Define a function to insert a new random question using the API
def insert_question():
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
    response = requests.post(ADD_API_URL, json=new_question)
    if response.status_code == 200:
        print("New question added successfully.")
    else:
        print("Error: Failed to add new question to the API.")

# Call the read_questions function to print all questions to the console
read_questions()

# Call the insert_question function to add a new random question to the API
insert_question()

# Call the read_questions function again to confirm that the new question was added successfully
read_questions()
