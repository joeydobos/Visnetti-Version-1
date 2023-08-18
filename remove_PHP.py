import os
import re

def remove_php_from_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    # Remove PHP tags and their contents using regular expression
    cleaned_content = re.sub(r'(<\?php).*?(\?>)', '', content, flags=re.DOTALL)

    with open(file_path, 'w') as file:
        file.write(cleaned_content)

def process_directory(directory):
    for dirpath, dirnames, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith('.php'):
                file_path = os.path.join(dirpath, filename)
                remove_php_from_file(file_path)

if __name__ == "__main__":
    root_directory = '/Users/josephdobos/Desktop/Visnetti 3'

    process_directory(root_directory)

    print("PHP code removed from HTML files.")
