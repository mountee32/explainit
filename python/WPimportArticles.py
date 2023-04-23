import os
import base64
import requests
import pandas as pd
import openai
from dotenv import load_dotenv
from html import unescape
import os

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

def get_existing_tags():
    response = requests.get(f"{website}/wp-json/wp/v2/tags?per_page=100", headers=headers)
    tags = response.json()
    existing_tags = {tag['name']: tag['id'] for tag in tags}
    return existing_tags



def clear_console():
    os.system('cls' if os.name == 'nt' else 'clear')
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
def list_tags_per_post():
    response = requests.get(f"{website}/wp-json/wp/v2/posts?_embed&per_page=100", headers=headers)
    posts = response.json()
    for post in posts:
        title = unescape(post['title']['rendered'])
        tags = [tag['name'] for tag in post['_embedded']['wp:term'][1]]
        print(f"{title} - Tags: {', '.join(tags)}")

def get_best_matching_tags(post_titles, existing_tags):
    prompt = f"Given the following post titles and tags:\n\nTitles:\n"
    prompt += "\n".join(post_titles)
    prompt += f"\n\nTags:\n{', '.join(existing_tags)}\n\nPlease provide the best matching tags for each post title, where a post can have multiple relevant tags. Do NOT include the post title as a tag. Separate tags for each post with commas and put each title with its tags on a new line."

    response = openai.Completion.create(
        engine=myengine,
        prompt=prompt,
        max_tokens=int(mytokens),
        n=1,
        stop=None,
        temperature=0.5,  # Changed temperature to 0.5
    )

    matching_tags = response.choices[0].text.strip().split("\n")
    matching_tags = [
        ", ".join([
            tag.strip() for tag in tags.split(",") 
            if tag.strip() not in post_titles and not any(title in tag for title in post_titles)
        ]) for tags in matching_tags
    ]
    return matching_tags

def create_tag_if_not_exists(tag_name):
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
    }
    data = {
        "name": tag_name,
    }
    response = requests.post(f"{website}/wp-json/wp/v2/tags", headers=headers, json=data)
    if response.status_code == 201:
        print(f"Successfully created tag '{tag_name}' with ID {response.json()['id']}.")
        return response.json()['id']
    else:
        print(f"Error creating tag '{tag_name}': {response.status_code} - {response.text}")
        return None


def update_post_tags(post_id, tag_ids):
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
    }
    data = {
        "tags": tag_ids,
    }
    response = requests.post(f"{website}/wp-json/wp/v2/posts/{post_id}", headers=headers, json=data)
    if response.status_code == 200:
        print(f"Successfully updated tags for post ID {post_id}.")
    else:
        print(f"Error updating tags for post ID {post_id}: {response.status_code} - {response.text}")
    return response.json()

def manage_tags_for_posts():
    existing_titles = list_current_questions()
    existing_tags = get_existing_tags()

    while True:
        suggested_tags = get_best_matching_tags(existing_titles, existing_tags)

        if len(suggested_tags) != len(existing_titles):
            print("There was an issue retrieving the suggested tags. Retrying...")
            continue

        print("\nSuggested tags for posts:")
        for i, suggested_tag in enumerate(suggested_tags):
            print(f"{existing_titles[i]} - Tags: {suggested_tag}")

        action = input("\nEnter 'Accept' to update tags, 'Retry' to generate new suggestions, or 'Cancel' to return to the main menu: ")

        if action.lower() == 'accept':
            response = requests.get(f"{website}/wp-json/wp/v2/posts?_embed&per_page=100", headers=headers)
            posts = response.json()
            existing_tags = get_existing_tags()
            for post, suggested_tag in zip(posts, suggested_tags):
                post_id = post['id']
                tag_ids = [
                    existing_tags[tag.strip()] if tag.strip() in existing_tags else create_tag_if_not_exists(tag.strip())
                    for tag in suggested_tag.split(', ')
                ]
                update_post_tags(post_id, tag_ids)  # Pass post_id and tag_ids to update_post_tags
                        # Wait for a key press before returning to the main menu
            input("Press any key to return to the main menu...")
            break
        elif action.lower() == 'retry':
            continue
        elif action.lower() == 'cancel':
            break
        else:
            print("Invalid input. Please enter 'Accept', 'Retry', or 'Cancel'.")


while True:
    clear_console()  # Add this line to clear the console before displaying the menu
    print("\nMenu:")
    print("\nMenu:")
    print("1. List current questions")
    print("2. Import CSV Posts")
    print("3. Exit")
    print("4. Request GPT-3 to generate and upload 5 new questions")
    print("5. List WordPress tags per post")
    print("6. Get best matching tags for posts and update")  # Added menu option 6
    choice = input("Enter your choice (1-6): ")

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
    elif choice == '5':
        list_tags_per_post()
    elif choice == '6':  # Added choice for the new menu option 6
        manage_tags_for_posts()
    else:
        print("Invalid choice. Please enter a number between 1 and 6.")
