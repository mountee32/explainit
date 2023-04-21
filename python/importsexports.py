import csv
import requests

API_QA_URL = "https://explainit.app/api/qaquestions.php"
API_ST_URL = "https://explainit.app/api/stquestions.php"
QUICK_ANSWERS_FILE = "extract-quick-answers.csv"
CONVERSATION_STARTERS_FILE = "csv/conversation-starters.csv"

def menu():
    print("Menu:")
    print("1. Export Quick Answers")
    print("2. Delete All Quick Answers")
    print("3. Import Quick Answers")
    print("4. Export Conversation Starters")
    print("5. Delete All Conversation Starters")
    print("6. Import Conversation Starters")
    print("7. Exit")
    choice = input("Please select an option (1-7): ")
    return int(choice)

def export_quick_answers():
    response = requests.get(API_QA_URL, params={"action": "read"})
    if response.status_code == 200:
        quick_answers = response.json()
        with open(QUICK_ANSWERS_FILE , "w", newline="") as csvfile:
            fieldnames = ["ID", "CATEGORY", "QUESTION", "ANSWER", "LINK"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for qa in quick_answers:
                writer.writerow({
                    "ID": qa["id"],
                    "CATEGORY": qa["category"],
                    "QUESTION": qa["question"],
                    "ANSWER": qa["answer"],
                    "LINK": qa["link"]
                })
        print("Quick Answers exported successfully.")
    else:
        print("Failed to fetch Quick Answers.")

def delete_all_quick_answers():
    response = requests.get(API_QA_URL, params={"action": "read"})
    if response.status_code == 200:
        quick_answers = response.json()
        for qa in quick_answers:
            requests.post(API_QA_URL, json={"action": "delete", "id": qa["id"]})
        print("All Quick Answers deleted successfully.")
    else:
        print("Failed to fetch Quick Answers.")

def import_quick_answers():
    with open(QUICK_ANSWERS_FILE, mode="r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data = {
                "action": "create",
                "category": row["CATEGORY"],
                "question": row["QUESTION"],
                "link": row["LINK"],
                "answer": row["ANSWER"],
            }
            response = requests.post(API_QA_URL, json=data)
            if response.status_code == 201:
                print(f"Successfully imported Quick Answer: {row['QUESTION']}")
            else:
                try:
                    error_message = response.json()['message']
                except json.JSONDecodeError:
                    error_message = "Server returned an empty response or an invalid JSON."
                print(f"Failed to import Quick Answer: {row['QUESTION']} - {error_message}")


def export_conversation_starters():
    response = requests.get(API_ST_URL, params={"action": "read"})
    if response.status_code == 200:
        conversation_starters = response.json()
        with open(CONVERSATION_STARTERS_FILE, "w", newline="") as csvfile:
            fieldnames = ["ID", "CATEGORY", "QUESTION", "ANSWER", "LINK"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for cs in conversation_starters:
                writer.writerow({
                    "ID": cs["id"],
                    "CATEGORY": cs["category"],
                    "QUESTION": cs["question"],
                    "ANSWER": cs["answer"],
                    "LINK": cs["link"]
                })
        print("Conversation Starters exported successfully.")
    else:
        print("Failed to fetch Conversation Starters.")
        
def delete_all_conversation_starters():
    response = requests.get(API_ST_URL, params={"action": "read"})
    if response.status_code == 200:
        conversation_starters = response.json()
        for cs in conversation_starters:
            requests.post(API_ST_URL, json={"action": "delete", "id": cs["id"]})
        print("All Conversation Starters deleted successfully.")
    else:
        print("Failed to fetch Conversation Starters.")


def import_conversation_starters():
    with open(CONVERSATION_STARTERS_FILE, mode="r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data = {
                "action": "create",
                "category": row["CATEGORY"],
                "question": row["QUESTION"],
                "link": row["LINK"],
                "answer": row["ANSWER"],
            }
            response = requests.post(API_ST_URL,json=data)
            if response.status_code == 201:
                print(f"Successfully imported Quick Answer: {row['QUESTION']}")
            else:
                try:
                    error_message = response.json()['message']
                except json.JSONDecodeError:
                    error_message = "Server returned an empty response or an invalid JSON."
                print(f"Failed to import Quick Answer: {row['QUESTION']} - {error_message}")




if __name__ == "__main__":
    while True:
        user_choice = menu()
        if user_choice == 1:
            export_quick_answers()
        elif user_choice == 2:
            delete_all_quick_answers()
        elif user_choice == 3:
            import_quick_answers()
        elif user_choice == 4:
            export_conversation_starters()
        elif user_choice == 5:
            delete_all_conversation_starters()
        elif user_choice == 6:
            import_conversation_starters()
        elif user_choice == 7:
            print("Exiting...")
            break
        else:
            print("Invalid choice. Please try again.")
