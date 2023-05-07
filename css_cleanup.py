import os
import re
import click
import shutil
import csv
from bs4 import BeautifulSoup
from collections import defaultdict
import cssutils
import codecs


@click.command()
@click.option('--project-path', default='.', help='Path to the project directory.')
@click.option('--file-types', default='css,html,js', help='File types to process, separated by commas (e.g., css,html,js).')
@click.option('--dry-run', is_flag=True, help='Enable dry-run mode to preview changes without modifying files.')
@click.option('--backup', is_flag=True, help='Create backup copies of original files before modifying.')

def css_cleanup(project_path, file_types, dry_run, backup):
    # Parse the file types input
    file_types = [ft.strip() for ft in file_types.split(',')]
    
    print(f"Starting css_cleanup on project path: {project_path}")

    css_styles = parse_css_files(project_path, file_types)
    used_styles = parse_html_js_files(project_path, file_types)

    print("Writing styles-defined.csv")
    with open('styles-defined.csv', 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['CSS File', 'Style', 'Count'])
        for css_file, styles in css_styles.items():
            for style, count in styles.items():
                writer.writerow([css_file, style, count])

    print("Writing styles-called.csv")
    with open('styles-called.csv', 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['CSS File', 'Style'])
        for css_file, styles in used_styles.items():
            for style in styles.keys():
                writer.writerow([css_file, style])

    print("Finished")


def parse_css_files(project_path, file_types):
    css_styles = defaultdict(lambda: defaultdict(int))

    print(f"Parsing CSS files in {project_path}")
    for root, _, files in os.walk(project_path):
        for file in files:
            file_path = os.path.join(root, file)
            _, ext = os.path.splitext(file_path)
            ext = ext[1:]  # Remove the dot from the extension

            if ext in file_types and ext == 'css':
                print(f"Processing CSS file: {file_path}")
                with codecs.open(file_path, 'r', encoding='utf-8-sig') as file:
                    content = file.read()

                    print(f"Content of {file_path}:\n{content}\n")

                    line_count = len(content.splitlines())
                    print(f"Total lines in {file_path}: {line_count}")

                    css_parser = cssutils.CSSParser()
                    sheet = css_parser.parseString(content)

                    css_selectors = [rule.selectorText for rule in sheet if isinstance(rule, cssutils.css.CSSStyleRule)]

                    print(f"Found {len(css_selectors)} CSS selectors in {file_path}")

                    for selector in css_selectors:
                        css_styles[file_path][selector] += 1

    return css_styles


def parse_html_js_files(project_path, file_types):
    used_styles = defaultdict(dict)

    print(f"Parsing HTML and JS files in {project_path}")
    for root, _, files in os.walk(project_path):
        for file in files:
            file_path = os.path.join(root, file)
            _, ext = os.path.splitext(file_path)
            ext = ext[1:]  # Remove the dot from the extension

            if ext in file_types:
                print(f"Processing {ext.upper()} file: {file_path}")
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read()

                    if ext == 'html':
                        soup = BeautifulSoup(content, 'html.parser')
                        linked_stylesheets = [link['href'] for link in soup.find_all('link', rel='stylesheet')]

                        for css_file in linked_stylesheets:
                            css_path = os.path.join(project_path, css_file)
                            used_styles[css_path] = {}

                        inline_styles = soup.find_all(style=True)
                        for element in inline_styles:
                            style = element['style']
                            if style:
                                css_path = os.path.join(project_path, 'inline_styles.css')
                                used_styles[css_path][style.strip()] = style.strip()
                    elif ext == 'js':
                        # Process JS files - this can be a placeholder if you'd like to add functionality to parse JS files later
                        pass

    return used_styles

def main():
    css_cleanup()


if __name__ == '__main__':
    main()
