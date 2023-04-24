# Bugs (1) no longer creates wordpress images (2) toggles on articles not working (3) not sure this is the 3.5 fast model

import os
import base64
import requests
import openai
from dotenv import load_dotenv
from html import unescape

# Load environment variables from .env file
load_dotenv()

# Retrieve the credentials and API keys from environment variables
username = os.getenv("WORDPRESS_USERNAME")
password = os.getenv("WORDPRESS_APP_PASSWORD")
website = os.getenv("WORDPRESS_URL")
openai_api_key = os.getenv("OPENAI_API_KEY")
pexels_api_key = os.getenv("PEXELS")
myengine = os.getenv("ENGINE")
mytokens = os.getenv("MAX_TOKENS")

headers = {
    "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
}

openai.api_key = openai_api_key

def search_image(tag, title):
    query = f"{tag} {title}"
    url = f"https://api.pexels.com/v1/search?query={query}&per_page=1"

    headers = {
        "Authorization": pexels_api_key
    }

    response = requests.get(url, headers=headers)
    data = response.json()

    if data['total_results'] > 0:
        return data['photos'][0]['src']['large']
    else:
        return None

def gpt_generate_article_content(title):
    prompt = f"Please write a 750 to 1000-word article about the following topic related to Christianity: '{title}'."
    response = openai.Completion.create(
        engine=myengine,
        prompt=prompt,
        max_tokens=int(mytokens),
        n=1,
        stop=None,
        temperature=0.8,
    )
    content = response.choices[0].text.strip()
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
    image_data = requests.get(image_url).content
    file_name = os.path.basename(image_url)
    media = {
        "file": (file_name, image_data, "image/jpeg")
    }
    response = requests.post(f"{website}/wp-json/wp/v2/media", headers=headers, files=media)
    if response.status_code == 201:
        return response.json()['id']
    else:
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

def upload_image_to_wordpress(image_url):
    response = requests.get(image_url)
    image_data = response.content

    file_name = image_url.split("/")[-1]
    file_type = file_name.split(".")[-1]

    media_headers = {
        "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
        "Content-Type": f"image/{file_type}",
        "Content-Disposition": f'attachment; filename="{file_name}"',
    }

    response = requests.post(f"{website}/wp-json/wp/v2/media", headers=media_headers, data=image_data)

    if response.status_code == 201:
        media_item = response.json()
        return media_item['id']
    else:
        return None


def get_existing_media():
    response = requests.get(f"{website}/wp-json/wp/v2/media?per_page=100", headers=headers)
    media_items = response.json()
    existing_media = {media_item['title']['rendered']: media_item['id'] for media_item in media_items}
    return existing_media
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
    prompt = f"Using your knowledge and understanding of Christianity as a Christian theologian and teacher, please identify 5 additional popular questions that are often asked of Christians about their faith and worldview related to the tag '{tag_name}' and that are not already covered in the following list. Please do not prefix them with numbers:\n\n"
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
    questions = response.choices[0].text.strip().split("\n")
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

    prompt = f"Please write a 750 to 1000-word article about the following topic related to Christianity: '{title}'."
    response = openai.Completion.create(
        engine=myengine,
        prompt=prompt,
        max_tokens=int(mytokens),
        n=1,
        stop=None,
        temperature=0.8,
    )
    content = response.choices[0].text.strip()

    return title, content
def confirm_custom_article(title, content):
    print(f"\nTitle: {title}\n")
    print(f"Content:\n{content}\n")
    action = input("Enter 'Yes' to save this article, or 'No' to discard it: ")

    return action.lower() == 'yes'
def gpt_generate_article_content(title):
    prompt = f"Please write a 750 to 1000-word article about the following topic related to Christianity: '{title}'."
    response = openai.Completion.create(
        engine=myengine,
        prompt=prompt,
        max_tokens=int(mytokens),
        n=1,
        stop=None,
        temperature=0.8,
    )
    content = response.choices[0].text.strip()
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
        if action.lower() in ['', 'yes']:
            questions_to_save.append(question)
    return questions_to_save
def main():
    existing_tags = get_existing_tags()

    while True:
        clear_console()
        print("Menu Options:")
        print("1. List current questions")
        print("2. Create a custom post")
        print("3. Generate new questions")
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
