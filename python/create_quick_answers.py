import csv
import os
import re
from chatbot import askgpt

def generate_quick_answers():
    input_file = "csv/topics_and_questions.csv"
    output_file = "csv/quick_answers.csv"
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

        for row in reader:
            if row not in existing_rows:
                category, question = row
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

                writer.writerow([category, question, answer.replace('\n', CUSTOM_NEWLINE_SEQ), link])

                print([category, question, answer.replace('\n', CUSTOM_NEWLINE_SEQ), link])
            else:
                writer.writerow(row)

generate_quick_answers()
