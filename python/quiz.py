import requests
import pandas as pd
import os
from dotenv import load_dotenv
import openai
import json
import re

load_dotenv()
openai.api_key = os.environ.get('OPENAI_API_KEY')
completion = openai.ChatCompletion()

API_URL = "https://ai4christians.com/api/quiz.php"

def get_all_questions():
    try:
        response = requests.get(API_URL, params={"action": "read"})
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

def delete_question(id):
    try:
        response = requests.post(API_URL, json={"action": "delete", "id": id})
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

def create_question(question_data):
    # Handle 'nan' values
    if pd.isna(question_data['category']):
        question_data['category'] = ''
    if pd.isna(question_data['status']):
        question_data['status'] = ''

    question_data.update({"action": "create"})

    print("Sending data:", question_data)
    try:
        response = requests.post(API_URL, json=question_data, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        print("API Response:", response.json())
    except requests.exceptions.HTTPError as errh:
        print(f"HTTP Error: {errh}")
        print(f"Response: {response.text}")
    except requests.exceptions.ConnectionError as errc:
        print(f"Error Connecting: {errc}")
    except requests.exceptions.Timeout as errt:
        print(f"Timeout Error: {errt}")
    except requests.exceptions.RequestException as err:
        print(f"Unexpected Error: {err}")



def print_questions(questions):
    df = pd.DataFrame(questions)
    print(df.to_csv(index=False))

def save_questions_to_csv(questions, file_path):
    df = pd.DataFrame(questions)
    try:
        df.to_csv(file_path, index=False)
        print(f"Questions saved to {file_path}")
    except IOError as e:
        print(f"Error: {e}")

def load_questions_from_csv(file_path):
    try:
        df = pd.read_csv(file_path)
        return df.to_dict('records')
    except IOError as e:
        print(f"Error: {e}")
        return None

def menu():
    print("1. List all questions")
    print("2. Export all questions to CSV")
    print("3. Delete all questions")
    print("4. Import all questions from CSV")
    print("5. Create new quiz questions with OpenAI")
    print("6. Exit")

def generate_questions(category, num_questions):
    questions = []
    for i in range(num_questions):
        question_data = {
            "action": "create",
            "question": "",
            "skill": "hard",
            "choice1": "",
            "choice2": "",
            "choice3": "",
            "choice4": "",
            "correct_choice": 0,
            "explanation1": "",
            "explanation2": "",
            "explanation3": "",
            "explanation4": "",
            "category": category,
            "status": "drafted"
        }

        chat_log = [
            {
                'role': 'system',
                'content': 'You are an assistant that generates quiz questions.',
            }
        ]

        question_prompt = {
            'role': 'user',
            'content': f"Please generate a quiz question related to the category {category} in JSON format with the following fields: `question`, 'skill', `choice1`, `choice2`, `choice3`, `choice4`, `correct_choice numbered 1 to 4`, `explanation1`, `explanation2`, `explanation3`, `explanation4`, 'category', 'status'. Please set the 'status' to draft, the 'category' to {category}, and the 'skill' to medium."
        }
        chat_log.append(question_prompt)

        print("Sending prompt to OpenAI: ", question_prompt['content'])

        response = completion.create(
            model='gpt-3.5-turbo',
            messages=chat_log
        )

        print("Received response from OpenAI: ", response.choices[0]['message']['content'])


        answer = response.choices[0]['message']['content']
        chat_log.append({'role': 'assistant', 'content': answer})
        # Extract JSON from answer using regex
        json_match = re.search(r'\{(.|\n)*\}', answer)
        if json_match:
            json_str = json_match.group()
        else:
            print("Invalid response from assistant. Could not extract JSON.")
            return []

        question_data.update(json.loads(json_str))  # update with the extracted JSON
        question_data["question"] = question_data["question"].replace("\n", "")  # Remove newline characters from the question
        questions.append(question_data)

    return questions


def main():
    while True:
        menu()
        choice = input("Choose an option: ")
        if choice == "1":
            questions = get_all_questions()
            if questions:
                print_questions(questions)
        elif choice == "2":
            questions = get_all_questions()
            if questions:
                file_path = input("Enter the CSV file path: ")
                save_questions_to_csv(questions, file_path)
        elif choice == "3":
            questions = get_all_questions()
            if questions:
                for question in questions:
                    delete_question(question["id"])
                print("All questions deleted.")
        elif choice == "4":
            file_path = input("Enter the CSV file path: ")
            questions = load_questions_from_csv(file_path)
            if questions:
                for question in questions:
                    create_question(question)
                print("All questions imported.")
        elif choice == "5":
            print("Select a category to generate questions for:")
            print("1. Christianity History")
            print("2. Bible Books")
            print("3. Bible Characters")
            category_choice = input("Choose a category: ")
            num_questions = input("Enter the number of questions to generate (default is 2): ")
            if not num_questions:
                num_questions = 2  # Default to 2 if no input
            else:
                try:
                    num_questions = int(num_questions)
                    if num_questions < 1:
                        raise ValueError("Number of questions must be at least 1")
                except ValueError:
                    print("Invalid number of questions. Defaulting to 2.")
                    num_questions = 2
            categories = {
                "1": "Christianity History",
                "2": "Bible Books",
                "3": "Bible Characters",
            }
            if category_choice in categories:
                questions = generate_questions(categories[category_choice], num_questions)
                for question in questions:
                    create_question(question)
                print("Quiz questions created and uploaded.")
            else:
                print("Invalid category choice.")

        elif choice == "6":
            break
        else:
            print("Invalid choice. Please enter a number from 1 to 6.")

if __name__ == "__main__":
    main()