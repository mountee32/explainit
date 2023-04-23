import os
import base64
import requests
import pandas as pd
from dotenv import load_dotenv
from html import unescape

# Load environment variables from .env file
load_dotenv()

# Retrieve the username and password from environment variables
username = os.getenv("WORDPRESS_USERNAME")
password = os.getenv("WORDPRESS_APP_PASSWORD")
website = os.getenv("WORDPRESS_URL")
csv_file = 'csv/uploadposts.csv'

headers = {
    "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
}

def list_current_questions():
    response = requests.get(f"{website}/wp-json/wp/v2/posts?categories=1&per_page=100", headers=headers)
    posts = response.json()
    print("Current questions:")
    for post in posts:
        print(unescape(post['title']['rendered']))
    
    print("\nGPT-4 prompt:")
    existing_titles = [unescape(post['title']['rendered']) for post in posts]
    prompt = f"Using your knowledge and understanding of Christianity, please identify 5 additional popular questions that are often asked of Christians about their faith and worldview that are not already covered in the following list:\n\n"
    prompt += "\n".join(existing_titles)
    prompt += "\n\nFor each of the 5 questions, please write an article in CSV format that is compatible with the uploader provided. Each article should be between 250 and 500 words. Use the following format for each article: title, content, tags, category\n"
    print(prompt)

def import_csv_posts():
    # Read the CSV file
    df = pd.read_csv(csv_file)

    # Loop through each row in the CSV file and post the article
    for index, row in df.iterrows():
        title = row['title']
        content = row['content']
        category = "1"

        response = post_article(title, content, category)

        if 'id' in response:
            print(f"Successfully posted article '{title}' with ID {response['id']}.")
        else:
            print(f"Error posting article '{title}': {response['code']} - {response['message']}")

while True:
    print("\nMenu:")
    print("1. List current questions")
    print("2. Import CSV Posts")
    print("3. Exit")
    choice = input("Enter your choice (1-3): ")

    if choice == '1':
        list_current_questions()
    elif choice == '2':
        import_csv_posts()
    elif choice == '3':
        print("Exiting...")
        break
    else:
        print("Invalid choice. Please enter a number between 1 and 3.")
