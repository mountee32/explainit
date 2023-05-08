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
        pattern = r'(?P<selector>[^{]+)\s*{\s*(?P<properties>[^}]+)}'
        matches = re.findall(pattern, content, re.MULTILINE)
        style_defs = {}
        for match in matches:
            selector = match[0].strip()
            properties = match[1].strip()
            style_defs[selector] = properties
        return style_defs
    return {}

def parse_file(entry_path, styles_defined):
    if entry_path.endswith('.css'):
        style_defs = parse_css(entry_path)
        if style_defs:
            styles_defined[entry_path] = style_defs

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
        writer.writerow(['File', 'Style', 'Properties'])
        for file, style_defs in styles_defined.items():
            for selector, properties in style_defs.items():
                writer.writerow([file, selector, properties])

def main():
    parser = argparse.ArgumentParser(description="CSS cleanup utility - Iteration 2")
    parser.add_argument("-p", "--path", type=str, default=os.getcwd(), help="Path of the project directory")
    args = parser.parse_args()

    current_folder = args.path

    styles_defined = {}

    traverse_and_parse_contents(current_folder, styles_defined)

    export_styles_defined_to_csv('styles-defined.csv', styles_defined)

if __name__ == "__main__":
    main()
