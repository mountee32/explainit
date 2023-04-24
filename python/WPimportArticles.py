import os
import base64
import requests
import openai
from dotenv import load_dotenv
from html import unescape

# Load environment variables from .env file
load_dotenv()

# Retrieve the username and password from environment variables
username = os.getenv("WORDPRESS_USERNAME")
password = os.getenv("WORDPRESS_APP_PASSWORD")
website = os.getenv("WORDPRESS_URL")
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


def post_article(title, content, category, tag_id):
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
    }
    data = {
        "title": title,
        "content": content,
        "status": "publish",
        "categories": category,
        "tags": [tag_id],
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
                    prompt = f"Please write an article about the following question related to Christianity: '{question}'. The article should be between 500 and 1000 words. Include a link to an external article or resource for further reading."

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

                    post_article(question, content, 1, tag_id)
                    print(f"\nArticle '{question}' created with tag '{tag_name}'.")
                input("\nPress Enter to return to the main menu...")


        elif option == '0':
            print("\nExiting the program. Goodbye!")
            break
        else:
            print("\nInvalid option. Please try again.")
            input("Press Enter to return to the main menu...")

if __name__ == "__main__":
    main()
