import os
import argparse
import csv
import re
from collections import defaultdict

def read_file_contents(path):
    try:
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
            return content
    except Exception as e:
        print(f'Error reading file {path}: {e}')
        return None

def parse_css(entry_path):
    content = read_file_contents(entry_path)
    if content:
        # Remove CSS comments
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

        # Updated pattern to exclude at-rules and match only valid style names
        pattern = r'(?P<selector>[^@{}]+)\s*{\s*(?P<properties>[^}]+)}'
        matches = re.finditer(pattern, content, re.MULTILINE)

        valid_selector = re.compile(r'^[.#]?[a-zA-Z][a-zA-Z0-9_-]*')
        style_data = [(match.group('selector').strip(), content[:match.start()].count('\n') + 1) for match in matches if valid_selector.match(match.group('selector').strip())]
        return style_data
    return []
def parse_file(entry_path, styles_defined):
    if entry_path.endswith('.css'):
        style_names = parse_css(entry_path)
        if style_names:
            styles_defined[entry_path] = style_names

def traverse_and_parse_contents(current_path, styles_defined):
    for entry in os.listdir(current_path):
        entry_path = os.path.join(current_path, entry)
        if os.path.isfile(entry_path):
            parse_file(entry_path, styles_defined)
        elif os.path.isdir(entry_path):
            traverse_and_parse_contents(entry_path, styles_defined)

def export_styles_defined_to_csv(filename, styles_defined):
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile, quoting=csv.QUOTE_MINIMAL)
        writer.writerow(['File', 'Style', 'Line'])
        for file, style_data in styles_defined.items():
            for selector, line in style_data:
                writer.writerow([file, selector, line])
def sort_css_styles(file_path):
    style_data = parse_css(file_path)

    # Sort style_data alphabetically based on the style selector
    style_data.sort(key=lambda x: x[0])

    content = read_file_contents(file_path)
    # Remove CSS comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

    sorted_content = ""
    for style, line_number in style_data:
        match = re.search(rf"{style}\s*{{[^}}]*}}", content, re.MULTILINE)
        if match:
            sorted_content += f"{match.group()}\n\n"

    with open("styles_sorted.css", "w", encoding="utf-8") as sorted_file:
        sorted_file.write(sorted_content)

def main():
    while True:
        print("\nOptions:")
        print("1. Create CSV with style names")
        print("2. Sort CSS styles alphabetically and save to styles_sorted.css")
        print("3. Exit")
        choice = input("\nEnter your choice (1, 2, or 3): ")

        if choice == "1":
            styles_defined = dict()
            for root, _, files in os.walk("."):
                for file in files:
                    if file.endswith(".css"):
                        entry_path = os.path.join(root, file)
                        style_data = parse_css(entry_path)
                        if style_data:
                            styles_defined[entry_path] = style_data

            export_styles_defined_to_csv("styles.csv", styles_defined)
            print("\nCSV file created: styles.csv")

        elif choice == "2":
            file_path = input("\nEnter the CSS file path to be sorted: ")
            if os.path.isfile(file_path) and file_path.endswith(".css"):
                sort_css_styles(file_path)
                print("\nSorted CSS styles saved to styles_sorted.css")
            else:
                print("\nInvalid file path. Please provide a valid CSS file path.")

        elif choice == "3":
            print("\nGoodbye!")
            break

        else:
            print("\nInvalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()