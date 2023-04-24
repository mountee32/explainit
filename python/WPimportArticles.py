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

    generated_questions = response.choices[0].text.strip().split("\n")
    generated_questions = [question.split('. ')[1] if '. ' in question else question for question in generated_questions]
    return generated_questions

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


def search_image(tag_name, title):
    headers = {
        "Authorization": pexels_api_key
    }
    query = f"{tag_name} {title}"
    response = requests.get(f"https://api.pexels.com/v1/search?query={query}&per_page=1", headers=headers)
    data = response.json()

    if data['total_results'] > 0:
        return data['photos'][0]['src']['large']
    else:
        return None

def upload_image_to_wordpress(image_url):
    # Download the image
    response = requests.get(image_url)
    image_data = response.content
    image_filename = image_url.split("/")[-1].split("?")[0]  # Remove query parameters from the filename

    # Check if the image already exists in the WordPress media library
    existing_media = get_existing_media()
    if image_filename in existing_media:
        print(f"Image '{image_filename}' already exists in the WordPress media library.")
        return existing_media[image_filename]

    # Prepare headers
    auth_str = f"{username}:{password}"
    auth_str_encoded = base64.b64encode(auth_str.encode()).decode()
    headers = {
        "Authorization": f"Basic {auth_str_encoded}",
        "Content-Disposition": f"attachment; filename={image_filename}",
        "Content-Type": response.headers["Content-Type"],
    }

    # Upload the image to WordPress
    upload_url = f"{website}/wp-json/wp/v2/media"
    response = requests.post(upload_url, headers=headers, data=image_data)

    if response.status_code == 201:
        return response.json()["id"]
    else:
        print(f"Error uploading image to WordPress: {response.status_code} {response.reason}")
        print(f"Image URL: {image_url}")
        print(f"Image filename: {image_filename}")
        print(f"Headers: {headers}")
        print(f"Response content: {response.content.decode('utf-8')}")
        return None



def post_article(title, content, category, tag_id, featured_image):
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
    }
    data = {
        "title": title,
        "content": content,
        "status": "publish",
        "categories": category,
        "tags": [tag_id],
        "featured_media": featured_image,
    }
    response = requests.post(f"{website}/wp-json/wp/v2/posts", headers=headers, data=data)
    return response.status_code

def main():
    existing_tags = get_existing_tags()

    while True:
        clear_console()
        print("Menu Options:")
        print("1. List current questions")
        print("3. Generate new questions")
        print("0. Exit the program")

        option = input("\nSelect an option: ")

        if option == '1':
            existing_titles = list_current_questions()
            print("\nCurrent questions on the website:")
            for title in existing_titles:
                print(title)
            input("\nPress Enter to return to the main menu...")

        elif option == '3':
            print("\nAvailable tags:")
            for i, (tag_name, _) in enumerate(existing_tags.items()):
                print(f"{i + 1}. {tag_name}")

            tag_option = int(input("\nSelect a tag to generate questions for: ")) - 1
            tag_name, tag_id = list(existing_tags.items())[tag_option]
            generated_questions = request_and_confirm_questions(tag_name)

            if generated_questions:
                for question in generated_questions:
                    prompt = f"Please write an article about the following question related to Christianity: '{question}'. The article should be between 750 and 1000 words. "

                    response = openai.Completion.create(
                        engine="text-davinci-003",
                        prompt=prompt,
                        max_tokens=2049,
                        n=1,
                        stop=None,
                        temperature=0.8,
                    )

                    content = response.choices[0].text.strip()

                    # Add the link as a formatted HTML hyperlink
                    link_text = "Read more here"
                    link_url = content.split()[-1]
                    hyperlink = f'<a href="{link_url}" target="_blank" rel="noopener noreferrer">{link_text}</a>'
                    content = content.replace(link_url, hyperlink)

                    # Search for an image using the tag_name and question title
                    image_url = search_image(tag_name, question)
                    if image_url:
                        # Upload the image to WordPress and get the image ID
                        featured_image_id = upload_image_to_wordpress(image_url)

                        # Post the article with the featured image ID
                        status_code = post_article(question, content, 1, tag_id, featured_image_id)

                        if status_code == 201:
                            print(f"\nArticle '{question}' created with tag '{tag_name}' and featured image.")
                        else:
                            print(f"\nError creating article '{question}' with tag '{tag_name}' and featured image.")
                    else:
                        print(f"\nNo suitable image found for '{question}'. Creating the article without a featured image.")
                        status_code = post_article(question, content, 1, tag_id, None)

                        if status_code == 201:
                            print(f"\nArticle '{question}' created with tag '{tag_name}' but without a featured image.")
                        else:
                            print(f"\nError creating article '{question}' with tag '{tag_name}' and no featured image.")

                input("\nPress Enter to return to the main menu...")

if __name__ == "__main__":
    main()
