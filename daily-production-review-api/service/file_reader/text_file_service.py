from pathlib import Path
import re

def find_value_in_settings(file_path):
    try:
        txt = Path(file_path).read_text()
        lines = txt.split("\n")

        extracted_values = {
            "Monday": None,
            "Tuesday": None,
            "Wednesday": None,
            "Thursday": None,
            "Friday": None,
            "Job Progress per Station": None
        }

        # Loop through each line in the text file and extract the values
        for line in lines:
            if "Monday:" in line:
                extracted_values["Monday"] = int(line.split(":")[1].strip())
            elif "Tuesday:" in line:
                extracted_values["Tuesday"] = int(line.split(":")[1].strip())
            elif "Wednesday" in line:
                extracted_values["Wednesday"] = int(line.split(":")[1].strip())
            elif "Thursday" in line:
                extracted_values["Thursday"] = int(line.split(":")[1].strip())
            elif "Friday" in line:
                extracted_values["Friday"] = int(line.split(":")[1].strip())
            elif "Job Progress per Station" in line:
                extracted_values["Job Progress per Station"] = re.search(r'(\d+) mins', line).group(1)

        return extracted_values

    except FileNotFoundError:
        return {"error": f"File not found: {file_path}"}


# Find the value of a given key in the settings file content
def find_value_of_given_key(data, key_to_find):
    if key_to_find in data:
        return data[key_to_find]
    else:
        return f"The key '{key_to_find}' does not exist in the dictionary."


def extract_excel_path(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

        # Find the index of the line containing "Main Line Daily Production Schedule Excel Path:"
    start_index = content.find("Main Line Daily Production Schedule Excel Path:")

    if start_index != -1:
        # Extract the substring after the specified line
        path_line = content[start_index:]
        path_start_index = path_line.find(":") + 1
        excel_path = path_line[path_start_index:].strip()

        # Find the end index of the line containing the Excel path
        end_index = excel_path.find("\n")
        if end_index != -1:
            excel_path = excel_path[:end_index].strip()

        return excel_path

    return None


def save_response_to_file(response_data):
    file_path = "response.txt"
    with open(file_path, "r+") as file:
        content = file.read()
        file.seek(0, 0)  # Move the cursor to the start of the file
        file.write('\n'.join(map(str, response_data)) + "\n" + content)


def read_response_from_file():
    file_path = "response.txt"
    try:
        with open(file_path, "r") as file:
            # Read lines and create a list
            lines = file.readlines()
        return lines
    except FileNotFoundError:
        return []

def clear_response_file():
    with open("response.txt", "w") as file:
        file.truncate(0)


def extract_job_progress_time_from_text_file(file_path):
    try:
        with open(file_path, 'r') as file:
            file_content = file.read()

            pattern = r"Job Progress per Station: (\d+)"

            match = re.search(pattern, file_content)

            if match:
                job_progress_time = int(match.group(1))
                return job_progress_time
            else:
                return None

    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return None


def get_file_save_time(file_path):
    try:
        with open(file_path, 'r') as file:
            file_content = file.read()

        # Search for the line containing "File save at:"
        file_save_line = [line for line in file_content.split('\n') if 'File save at:' in line]

        # Extract the time value from the line
        if file_save_line:
            time_value = file_save_line[0].split(':')[-1].strip()
            return time_value
        else:
            return None

    except FileNotFoundError:
        print(f"File not found at path: {file_path}")
        return None


def read_text_file(file_path):
    production_info = {}
    current_key = None

    with open(file_path, "r") as file:
        for line in file:
            line = line.strip()

            if ":" in line and "xls" not in line and "00:00:00" not in line:
                current_key = line.split(":")[0].strip()
                value_match = re.search(r'\d+', line)
                production_info[current_key] = value_match.group() if value_match else ""
            elif "=" in line:
                if "+" in line:
                    current_key, value = map(str.strip, re.split(r'\+', line, 1))
                    current_key = current_key + " + "
                elif "-" in line:
                    current_key, value = map(str.strip, re.split(r'-', line, 1))
                    current_key = current_key + " - "

                sign_index = value.find('+')
                if sign_index == -1:
                    sign_index = value.find('-')

                if sign_index != -1:
                    production_info[current_key] = value[sign_index:].strip()
                else:
                    production_info[current_key] = value.strip()

            if "Main Line Daily Production Schedule Excel Path" in line:
                current_key = line.split(":")[0].strip()
                production_info[current_key] = extract_excel_path(file_path)
            if "File save at:" in line:
                current_key = line.split(":")[0].strip()
                index = line.find("File save at:")
                production_info[current_key] = line[index + len("File save at:"):].strip()

    return production_info

