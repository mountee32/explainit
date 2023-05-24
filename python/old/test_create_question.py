import requests
import json

def create_question():

    CREATE_API_URL = "https://ai4christians.com/api/create.php"

    new_question = {
        "question": "_What is the smallest unit of matter?",
        "skill": "easy",
        "choices": ["Proton", "Electron", "Neutron", "Atom"],
        "correct": 4,
        "explanations": [
            "Atoms are the basic units of matter",
            "They are made up of a nucleus containing protons and neutrons, and electrons orbiting around the nucleus",
            "Different types of atoms make up the different elements",
            "Atoms can combine to form molecules and compounds"
        ]
    }

    try:
        response = requests.post(CREATE_API_URL, json=new_question)
        if response.status_code == 200:
            print("New question created successfully.")
        else:
            print("Error: Failed to create new question using the API. Status code: " + str(response.status_code) + " Response text: " + response.text)
    except Exception as e:
        print("Error: " + str(e))

create_question()