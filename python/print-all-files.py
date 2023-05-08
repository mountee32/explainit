import os

def print_file_contents(path):
    try:
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
            print(f'===== {path} =====')
            print(content)
    except Exception as e:
        print(f'Error reading file {path}: {e}')

def traverse_and_print_contents(current_path):
    for entry in os.listdir(current_path):
        entry_path = os.path.join(current_path, entry)
        if os.path.isfile(entry_path):
            print_file_contents(entry_path)
        elif os.path.isdir(entry_path):
            traverse_and_print_contents(entry_path)

if __name__ == "__main__":
    current_folder = os.getcwd()
    traverse_and_print_contents(current_folder)
