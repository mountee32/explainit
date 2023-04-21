import json
import csv

# Read the JSON data
with open("JSON/starters.json", "r") as json_file:
    data = json.load(json_file)

# Prepare CSV data
csv_data = []
for category in data["categories"]:
    for question in category["questions"]:
        row = {
            "CATEGORY": category["title"],
            "QUESTION": question["question"],
            "ANSWER": question["answer"],
            "LINK": question["link"]
        }
        csv_data.append(row)

# Write the CSV data
with open("output_data.csv", "w", newline="") as csvfile:
    fieldnames = ["CATEGORY", "QUESTION", "ANSWER", "LINK"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for row in csv_data:
        writer.writerow(row)

print("JSON data has been converted to CSV format.")
