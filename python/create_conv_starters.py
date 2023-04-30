import csv
import os
import re
from chatbot import askgpt

def generate_content(input_file, output_file, conversation_starter=False):
    CUSTOM_NEWLINE_SEQ = "---"

    with open(input_file, "r", newline="", encoding="utf-8") as infile, open(output_file, "r+", newline="", encoding="utf-8") as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile, quoting=csv.QUOTE_ALL)  # Wrap fields in double quotes

        existing_rows = list(csv.reader(outfile))
        outfile.seek(0)
        outfile.truncate()

        # Write header row if it doesn't exist
        if not existing_rows or existing_rows[0] != ["CATEGORY", "QUESTION", "ANSWER", "LINK"]:
            writer.writerow(["CATEGORY", "QUESTION", "ANSWER", "LINK"])

        # Skip header row if it exists in existing_rows
        if existing_rows and existing_rows[0] == ["CATEGORY", "QUESTION", "ANSWER", "LINK"]:
            existing_rows = existing_rows[1:]

        # Create a list of answered questions
        answered_questions = [row[1] for row in existing_rows]

        for row in reader:
            if len(row) >= 2:
                category, question = row
                if question not in answered_questions:
                    if conversation_starter:
                        answer_prompt = f"After a christian having a respectful conversation poses this question to a non-christian, how might they follow on in the conversation with the ultimate goal of sharing the gospel and please do not respond starting with the words as a {question}"
                    else:
                        answer_prompt = f"Answer the question: {question}"
                    answer, _ = askgpt(answer_prompt)
                    link_prompt = f"Provide a link for further reading on this topic: {question}"
                    link_input, _ = askgpt(link_prompt)

                    # Use regex to extract URL from link_input
                    url_regex = r'(https?://\S+)'
                    match = re.search(url_regex, link_input)
                    if match:
                        link = match.group(1)
                    else:
                        link = ''

                    # Write new row to output file
                    writer.writerow([category, question, answer.replace('\n', CUSTOM_NEWLINE_SEQ), link])

                    # Print the new row to the console
                    print([category, question, answer.replace('\n', CUSTOM_NEWLINE_SEQ), link])
                else:
                    # Write the existing row to output file
                    writer.writerow(row)

                    # Print the already answered question to the console
                    print(f"Question '{question}' is already answered.")
            else:
                print("Skipping an empty or incomplete row")

def main():
    while True:
        choice = input("Choose an option:\n(a) Quick Answers\n(b) Conversation Starters\n(q) Quit\n")
        if choice.lower() == 'a':
            input_file = "csv/quick_answers_topics_and_questions.csv"
            output_file = "csv/quick_answers.csv"
            generate_content(input_file, output_file, conversation_starter=False)
        elif choice.lower() == 'b':
            input_file = "csv/conversation_starters_topics_and_questions.csv"
            output_file = "csv/conversation_starters.csv"
            generate_content(input_file, output_file, conversation_starter=True)
        elif choice.lower() == 'q':
            break
        else:
            print("Invalid choice. Please enter 'a', 'b', or 'q'.")

if __name__ == "__main__":
    main()

