# Bugs  (1) total_tokens not going up (2) not sure this is the 3.5 fast model

import os
import base64
import requests
from dotenv import load_dotenv
from html import unescape
from PIL import Image
from io import BytesIO
import mimetypes
from chatbot import askgpt

# Load environment variables from .env file
load_dotenv()

# Retrieve the credentials and API keys from environment variables
username = os.getenv("WORDPRESS_USERNAME")
password = os.getenv("WORDPRESS_APP_PASSWORD")
website = os.getenv("WORDPRESS_URL")

pexels_api_key = os.getenv("PEXELS")

mytokens = os.getenv("MAX_TOKENS")
total_tokens = 0

headers = {
    "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
}


def search_image(tag, title):
    query = f"{tag} {title}"
    url = f"https://api.pexels.com/v1/search?query={query}&per_page=1&page=1"
    headers = {
        "Authorization": pexels_api_key,
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    if data['total_results'] > 0:
        # Change the size from 'large' to 'medium' or 'small' depending on your requirements
        return data['photos'][0]['src']['medium']
    else:
        return None


def gpt_generate_article_content(title):
    prompt = f"Please write a 750 to 1000-word article about the following topic related to Christianity: '{title}'."
    response, chat_log = askgpt(prompt)
    content = response.strip()
    return content

def search_image(tag, title):
    query = f"{tag} {title}"
    url = f"https://api.pexels.com/v1/search?query={query}&per_page=1&page=1"
    headers = {
        "Authorization": pexels_api_key,
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    if data['total_results'] > 0:
        return data['photos'][0]['src']['large']
    else:
        return None

def upload_image_to_wordpress(image_url):
    response = requests.get(image_url)
    image_data = response.content

    file_name = image_url.split("/")[-1]
    file_type = mimetypes.guess_type(image_url)[0]

    media_headers = {
        "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
        "Content-Disposition": f'attachment; filename="{file_name}"',
        "Content-Type": file_type,
    }

    response = requests.post(f"{website}/wp-json/wp/v2/media", headers=media_headers, data=image_data)

    if response.status_code == 201:
        media_item = response.json()
        return media_item['id']
    else:
        print(f"Error uploading image '{file_name}': {response.status_code} {response.reason}")
        print(f"Response content: {response.content}")
        return None


def post_article(title, content, category_id, tag_id, featured_image_id=None):
    post_data = {
        "title": title,
        "content": content,
        "status": "publish",
        "categories": [category_id],
        "tags": [tag_id],
    }

    if featured_image_id:
        post_data["featured_media"] = featured_image_id

    response = requests.post(f"{website}/wp-json/wp/v2/posts", headers=headers, json=post_data)

    return response.status_code

def get_existing_media():
    response = requests.get(f"{website}/wp-json/wp/v2/media?per_page=100", headers=headers)
    media_items = response.json()
    existing_media = {media_item['source_url'].split("?")[0]: media_item['id'] for media_item in media_items}
    return existing_media


def upload_image_to_wordpress(image_url):
    # Remove query parameters from the image URL
    clean_image_url = image_url.split("?")[0]
    print(f"Processing image URL: {clean_image_url}")

    response = requests.get(clean_image_url)
    image_data = response.content

    file_name = clean_image_url.split("/")[-1]
    file_type = mimetypes.guess_type(clean_image_url)[0]

    existing_media = get_existing_media()
    print(f"Checking if '{file_name}' exists in WordPress media...")
    print("Existing WordPress media filenames:")
    for existing_filename in existing_media:
        print(f" - {existing_filename}")

    if file_name in existing_media:
        print(f"Image '{file_name}' already exists in WordPress media.")
        return existing_media[file_name]
    else:
        print(f"Image '{file_name}' not found in WordPress media. Uploading...")
        media_headers = {
            "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
            "Content-Disposition": f'attachment; filename="{file_name}"',
            "Content-Type": file_type,
        }

        response = requests.post(f"{website}/wp-json/wp/v2/media", headers=media_headers, data=image_data)

        if response.status_code == 201:
            media_item = response.json()
            return media_item['id']
        else:
            print(f"Error uploading image '{file_name}': {response.status_code} {response.reason}")
            print(f"Response content: {response.content}")
            return None



def get_existing_media():
    media_headers = {
        "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
    }

    response = requests.get(f"{website}/wp-json/wp/v2/media", headers=media_headers)
    if response.status_code == 200:
        media_items = response.json()
        existing_media = {}

        for media_item in media_items:
            file_url = media_item['source_url']
            file_name = file_url.split("/")[-1]
            # Remove the '-scaled' suffix if present
            file_name = file_name.replace('-scaled', '')
            existing_media[file_name] = media_item['id']

        return existing_media
    else:
        print(f"Error retrieving media: {response.status_code} {response.reason}")
        print(f"Response content: {response.content}")
        return {}


def get_existing_tags():
    response = requests.get(f"{website}/wp-json/wp/v2/tags?per_page=100", headers=headers)
    tags = response.json()
    existing_tags = {tag['name']: tag['id'] for tag in tags}
    return existing_tags

def get_existing_categories():
    response = requests.get(f"{website}/wp-json/wp/v2/categories?per_page=100", headers=headers)
    categories = response.json()
    existing_categories = {category['name']: category['id'] for category in categories}
    return existing_categories

def clear_console():
    os.system('cls' if os.name == 'nt' else 'clear')

def list_current_questions():
    response = requests.get(f"{website}/wp-json/wp/v2/posts?categories=1&per_page=100", headers=headers)
    posts = response.json()
    existing_titles = [unescape(post['title']['rendered']) for post in posts]
    return existing_titles

def gpt_generate_questions(existing_titles, tag_name):
    prompt = f"Using your knowledge and understanding of Christianity as a Christian theologian and teacher, please identify 5 additional popular questions that are often asked of Christians about their faith and worldview related to the tag '{tag_name}' and that are not already covered in the following list. Please do NOT prefix them with numbers and a dot like in a numbered list:\n\n"
    prompt += "\n".join(existing_titles)
    prompt += "\n\nPlease list the 5 questions but do not prefix them with numbers and a dot"
    response, chat_log = askgpt(prompt)
    questions = response.strip().split("\n")
    return questions

def request_and_confirm_questions(tag_name):
    existing_titles = list_current_questions()
    while True:
        generated_questions = gpt_generate_questions(existing_titles, tag_name)
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

def request_custom_article():
    title = input("Enter the title of the article: ")
    prompt = f"Please write a 1500 to 2000-word article about the following topic related to Christianity: '{title}'."
    response, chat_log = askgpt(prompt)
    content = response.strip()
    return content

def confirm_custom_article(title, content):
    print(f"\nTitle: {title}\n")
    print(f"Content:\n{content}\n")
    action = input("Enter 'Yes' to save this article, or 'No' to discard it: ")

    return action.lower() == 'yes'

def gpt_generate_article_content(title):
    prompt = f"Please write a 750 to 1000-word article about the following topic related to Christianity: '{title}'."
    response, chat_log = askgpt(prompt)
    content = response.strip()
    return content

def select_tag(existing_tags):
    print("\nAvailable tags:")
    for i, (tag_name, _) in enumerate(existing_tags.items()):
        print(f"{i + 1}. {tag_name}")

    tag_option = int(input("\nSelect a tag to apply to the article: ")) - 1
    tag_name, tag_id = list(existing_tags.items())[tag_option]
    return tag_name, tag_id

def toggle_questions_to_save(generated_questions):
    questions_to_save = []
    for i, question in enumerate(generated_questions):
        print(f"{i + 1}. {question}")
        action = input("Enter 'Yes' to save this question or 'No' to discard it (default is 'Yes'): ")
        if action.lower() not in ['no']:
            questions_to_save.append(question)
    return questions_to_save

def does_article_exist(title):
    response = requests.get(f"{website}/wp-json/wp/v2/posts?per_page=100", headers=headers)
    posts = response.json()
    existing_titles = [unescape(post['title']['rendered']) for post in posts]
    return title in existing_titles

def main():
    existing_tags = get_existing_tags()

    while True:
        clear_console()
        print(f"Total tokens used so far: {total_tokens}")  # Print the total tokens used so far
        print("Menu Options:")
        print("1. List current articles / questions")
        print("2. Create a custom post")
        print("3. Generate new articles / questions")
        print("0. Exit the program")

        option = input("\nSelect an option: ")

        if option == '1':
            existing_titles = list_current_questions()
            print("\nCurrent questions on the website:")
            for title in existing_titles:
                print(title)
            input("\nPress Enter to return to the main menu...")

        elif option == '2':
            title = input("\nEnter the title of the article: ")
            if does_article_exist(title):
                print("\nAn article with this title already exists. Please use a different title.")
                continue
            content = gpt_generate_article_content(title) 
            if confirm_custom_article(title, content):
                tag_name, tag_id = select_tag(existing_tags)
                image_url = search_image(tag_name, title)
                if image_url:
                    featured_image_id = upload_image_to_wordpress(image_url)
                else:
                    featured_image_id = None
                status_code = post_article(title, content, 1, tag_id, featured_image_id)
                if status_code == 201:
                    print(f"\nArticle '{title}' created with tag '{tag_name}' and featured image.")
                else:
                    print(f"\nError creating article '{title}' with tag '{tag_name}' and featured image.")
            input("\nPress Enter to return to the main menu...")

        elif option == '3':
            print("\nAvailable tags:")
            for i, (tag_name, _) in enumerate(existing_tags.items()):
                print(f"{i + 1}. {tag_name}")

            tag_option = int(input("\nSelect a tag to generate questions for: ")) - 1
            tag_name, tag_id = list(existing_tags.items())[tag_option]
            generated_questions = request_and_confirm_questions(tag_name)

            if generated_questions:
                selected_questions = toggle_questions_to_save(generated_questions)

                for question in selected_questions:
                    if does_article_exist(question):
                        print(f"\nAn article titled '{question}' already exists. Skipping this one.")
                        continue
                    content = gpt_generate_article_content(question)
                    image_url = search_image(tag_name, question)
                    if image_url:
                        featured_image_id = upload_image_to_wordpress(image_url)
                    else:
                        featured_image_id = None
                    status_code = post_article(question, content, 1, tag_id, featured_image_id)
                    if status_code == 201:
                        print(f"\nArticle '{question}' created with tag '{tag_name}' and featured image.")
                    else:
                        print(f"\nError creating article '{question}' with tag '{tag_name}' and featured image.")
                input("\nPress Enter to return to the main menu...")

        elif option == '0':
            print("\nExiting the program.")
            break
        else:
            print("\nInvalid option. Please enter a valid option number.")
            input("\nPress Enter to return to the main menu...")

if __name__ == "__main__":
    main()
