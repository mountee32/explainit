import os
import base64
import requests
import pandas as pd
import openai
from dotenv import load_dotenv
from html import unescape

# Load environment variables from .env file
load_dotenv()

# Retrieve the username and password from environment variables
username = os.getenv("WORDPRESS_USERNAME")
password = os.getenv("WORDPRESS_APP_PASSWORD")
website = os.getenv("WORDPRESS_URL")
csv_file = 'csv/uploadposts.csv'
openai_api_key = os.getenv("OPENAI_API_KEY")
myengine = os.getenv("ENGINE")
mytokens = os.getenv("MAX_TOKENS")



headers = {
    "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
}

openai.api_key = openai_api_key

def list_current_questions():
    response = requests.get(f"{website}/wp-json/wp/v2/posts?categories=1&per_page=100", headers=headers)
    posts = response.json()
    existing_titles = [unescape(post['title']['rendered']) for post in posts]
    return existing_titles

def gpt_generate_questions(existing_titles):
    prompt = f"Using your knowledge and understanding of Christianity as a Christian theologian and teacher, please identify 5 additional popular questions that are often asked of Christians about their faith and worldview that are not already covered in the following list and please do not prefix them with numbers:\n\n"
    prompt += "\n".join(existing_titles)
    prompt += "\n\nPlease list the 5 questions."

    response = openai.Completion.create(
        engine=myengine,
        prompt=prompt,
        max_tokens=int(mytokens),
        n=1,
        stop=None,
        temperature=0.8,
    )

    generated_questions = response.choices[0].text.strip().split("\n")
    generated_questions = [question.split('. ')[1] if '. ' in question else question for question in generated_questions]
    return generated_questions


    generated_questions = response.choices[0].text.strip().split("\n")
    return generated_questions

def request_and_confirm_questions():
    existing_titles = list_current_questions()
    while True:
        generated_questions = gpt_generate_questions(existing_titles)
        print("\nSuggested questions:")
        for i, question in enumerate(generated_questions):
            print(f"{i + 1}. {question}")

        action = input("\nEnter 'Yes' to create articles for these questions, 'Retry' to generate new questions, or 'Cancel' to return to the main menu: ")

        if action.lower() == 'yes':
            return generated_questions
        elif action.lower() == 'retry':
            continue
        elif action.lower() == 'cancel':
            return None
        else:
            print("Invalid input. Please enter 'Yes', 'Retry', or 'Cancel'.")
def post_article(title, content, category):
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
    }
    data = {
        "title": title,
        "content": content,
        "status": "publish",
        "categories": category,
    }
    response = requests.post(f"{website}/wp-json/wp/v2/posts", headers=headers, json=data)
    return response.json()

def create_and_upload_articles(questions):
    for question in questions:
        # Generate the article content
        prompt = f"Please write an article about the following question related to Christianity: '{question}'. The article should be between 500 and 1000 words."

        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=2049,
            n=1,
            stop=None,
            temperature=0.8,
        )

        content = response.choices[0].text.strip()

        # Upload the article to the WordPress site
        category = "1"
        response = post_article(question, content, category)

        if 'id' in response:
            print(f"Successfully posted article '{question}' with ID {response['id']}.")
        else:
            print(f"Error posting article '{question}': {response['code']} - {response['message']}")

while True:
    print("\nMenu:")
    print("1. List current questions")
    print("2. Import CSV Posts")
    print("3. Exit")
    print("4. Request GPT-3 to generate and upload 5 new questions")
    choice = input("Enter your choice (1-4): ")

    if choice == '1':
        existing_titles = list_current_questions()
        print("\nCurrent questions:")
        for title in existing_titles:
            print(title)
    elif choice == '2':
        import_csv_posts()
    elif choice == '3':
        print("Exiting...")
        break
    elif choice == '4':
        questions_to_create = request_and_confirm_questions()
        if questions_to_create is not None:
            create_and_upload_articles(questions_to_create)
    else:
        print("Invalid choice. Please enter a number between 1 and 4.")
