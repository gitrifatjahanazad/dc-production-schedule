import ast
import os
from datetime import datetime, timezone, time

import pandas as pd

from service.database_service.retrive_data_by_date import get_previous_date, get_data_for_given_date, insert_into_db
from service.file_reader.text_file_service import save_response_to_file
from service.station_names import list_of_station_1to17

# current_station_index = 0
flag_second_req = False

def upload(all_dates, current_station_index):
    from main import main_settings_File_path
    global flag_second_req  # Use the global variables
    current_date_index = 0
    q_first_station_with_names = ""
    response_content = ""

    print("loading...")

    # Delete everything from the text file
    # if current_station_index == 0:
    #     clear_response_file()


    if 0 <= current_station_index < len(list_of_station_1to17):
        current_date = all_dates[current_station_index]

        q_first_station = get_data_for_given_date(current_date, main_settings_File_path)

        # Add station name to the response with the specified index
        q_first_station_with_names = [
            {"station_name": list_of_station_1to17[current_station_index], **q_first_station[i]}
            for i in range(len(q_first_station))
        ]

        # Check if the current station index is less than 17
        if current_station_index < 17:
            current_station_index += 1  # Simplified increment

            save_response_to_file(q_first_station_with_names)

async def insert_data_to_db(excel_path):
    insert_into_db(excel_path)

def queue_to_list(q):
    l = []
    while q.qsize() > 0:
        l.append(q.get())
    return l


def extract_fields_from_documents(documents):
    extracted_data = []
    for doc in documents:
        extracted_data.append([
            doc["chassisNo"],
            doc["model"],
            doc["dealer"]
        ])
    return extracted_data


def get_station_full_name(documents, station_list):
    station_no = 0
    for doc in documents:
        station_no = doc["stationNo"]
        break

    # Ensure the station number has a leading zero for single-digit numbers
    station_no = str(station_no).zfill(2)

    # Dictionary to map station numbers to their full names
    station_number_mapping = {}

    for station_info in station_list:
        parts = station_info.split(' ', 1)  # Split at the first space
        if len(parts) == 2:
            num, name = parts
            station_number_mapping[num.strip()] = station_info

    if station_no in station_number_mapping:
        return station_number_mapping[station_no]
    else:
        return "Station not found"


def get_todays_date():
    # Get the current date
    today = datetime.utcnow().date()

    # Combine the date with the desired time
    start_of_day = datetime(today.year, today.month, today.day, 0, 0, 0, 0, timezone.utc)

    # Format the combined datetime
    formatted_start_of_day = start_of_day.strftime("%Y-%m-%dT%H:%M:%S.%f")

    # Manually add the UTC offset
    formatted_start_of_day += "+00:00"
    return formatted_start_of_day

def get_previous_dates(start_date, num_dates):
    previous_dates = []
    previous_dates.append(start_date)

    current_date = start_date

    for _ in range(num_dates):
        x = get_previous_date(current_date)
        previous_dates.append(x)
        current_date = x

    return previous_dates

def is_midnight():
    current_time = datetime.now().time()
    midnight = time(0, 0, 0)
    return current_time == midnight

def create_folder_if_not_exists(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

def get_excel_file_name():
    # Get the current date
    current_date = datetime.now()

    # Format the date as "Friday 20th of October"
    formatted_date = current_date.strftime("%A %d of %B")

    # Create the complete string
    file_name = f"Daily Production Schedule {formatted_date}.xlsx"
    return file_name


def process_and_save_to_excel(input_file_path, output_file_path):
    with open(input_file_path, 'r') as file:
        data = [ast.literal_eval(line) for line in file]

    # Extract specific values from the dictionary keys
    df = pd.DataFrame({
        'PROCESS': [item['station_name'] for item in data],
        'DEALER': [item['dealer'] for item in data],
        'TARGET': [int(item['chassisNo']) for item in data],
        'MODEL': [item['model'] for item in data]
    })

    df['PROCESS'] = df['PROCESS'].where(~df.duplicated('PROCESS'), '')
    df['TARGET'] = pd.to_numeric(df['TARGET'], errors='coerce')

    print(df)

    df.to_excel(output_file_path, index=False)