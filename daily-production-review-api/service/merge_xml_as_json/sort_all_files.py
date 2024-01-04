import os

def get_latest_xml_files(keywords):
    latest_files = {}

    for keyword in keywords:
        latest_files[keyword] = sort_all_files(keyword)

    first_values = {key: values[0] for key, values in latest_files.items()}
    return first_values

def sort_all_files(keyword):
    directory_path = os.environ.get("XML_FOLDER_PATH", "./scheduler/scheduler_result")
    num_files = 3

    files_with_keyword = [file for file in os.listdir(directory_path) if keyword in file]
    sorted_files = sorted(files_with_keyword, key=lambda x: os.path.getmtime(os.path.join(directory_path, x)), reverse=True)
    return sorted_files[:num_files]