import atexit
import os
import threading
import time
import schedule
import uvicorn
import xmltodict
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_microsoft_identity import requires_auth, get_token_claims, initialize
from datetime import timedelta
from typing import Annotated
from threading import Thread, Event
from pydantic import BaseModel

from routes.route import router
from service.file_reader.text_file_service import (
    extract_job_progress_time_from_text_file,
    clear_response_file,
    get_file_save_time,
)
from service.services import (
    get_todays_date,
    get_previous_dates,
    upload,
    process_and_save_to_excel,
    create_folder_if_not_exists,
    get_excel_file_name,
    is_midnight,
)

app = FastAPI()
app.include_router(router)

# Enable CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

current_file_path = os.path.abspath(__file__)
current_directory = os.path.dirname(current_file_path)
main_settings_File_path = os.path.join(
    current_directory, "Main Line Daily Production Review Settings File.txt"
)
excel_file_name = get_excel_file_name()

todays_date_station1 = get_todays_date()
all_dates_to_show_data = get_previous_dates(todays_date_station1, 16)
progress_interval = extract_job_progress_time_from_text_file(main_settings_File_path)

input_file_path = os.path.join(current_directory, "response.txt")
output_folder = create_folder_if_not_exists(
    os.path.join(current_directory, "outputDirectory")
)
output_file_path = os.path.join(current_directory, "outputDirectory", excel_file_name)

counter = -1  # Initialize 'counter' with -1

# Event to signal threads to stop
shutdown_event = Event()


def handle_clear_response_file():
    if counter == -1:
        clear_response_file()


def upload_with_updated_index():
    global counter
    handle_clear_response_file()
    counter += 1
    upload(all_dates=all_dates_to_show_data, current_station_index=counter)

    if is_midnight():
        counter = -1
        process_and_save_to_excel(input_file_path, output_file_path)

    if counter > len(all_dates_to_show_data):
        counter = 17
        upload(all_dates=all_dates_to_show_data, current_station_index=counter)


def increment_counter_and_call_upload():
    global counter
    counter = -1
    upload_with_updated_index()
    schedule.every(int(progress_interval)).minutes.do(upload_with_updated_index)


increment_counter_and_call_upload()


def run_scheduler():
    while not exit_flag.is_set():
        schedule.run_pending()
        time.sleep(1)


# Create a threading.Event object named 'exit_flag' to signal the scheduler thread to exit
exit_flag = threading.Event()


# an exit handler to be called on program is exited
def exit_handler():
    exit_flag.set()  # Set the 'exit_flag' to signal the scheduler thread to exit
    scheduler_thread.join()  # Wait for the scheduler thread to finish before exiting


@app.post("/token_microsoft")
async def generate_token(request: Request):
    claims = get_token_claims(request)
    access_token_expires = timedelta(minutes=15)
    access_token, refresh_token = [123, 123]
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer",
    }


# Define a route to handle the GET request
@app.get("/xml_to_json")
async def convert_latest_xml_to_json():
    try:
        # Replace 'your_folder_path' with the path to your folder containing XML files
        folder_path = os.environ.get("XML_FOLDER_PATH", "./scheduler/scheduler_result")

        # List all XML files in the folder
        xml_files = [file for file in os.listdir(folder_path) if file.endswith(".xml")]

        if not xml_files:
            return JSONResponse(content={"error": "No XML files found in the folder."})

        # Find the latest XML file based on modification timestamp
        latest_xml_file = max(
            xml_files,
            key=lambda file: os.path.getmtime(os.path.join(folder_path, file)),
        )

        # Construct the full path to the latest XML file
        xml_file_path = os.path.join(folder_path, latest_xml_file)
        xml_string = open(xml_file_path, "r", encoding="cp1252").read()

        # Parse the latest XML file
        xmldict = xmltodict.parse(xml_string)
        raw_data = xmldict["soap:Envelope"]["soap:Body"]["GetScheduleAsXmlResponse"][
            "GetScheduleAsXmlResult"
        ]["NewDataSet"]["Schedule"]
        data = []
        for entry in raw_data:
            new_entry = {}
            for key in entry.keys():
                new_key = key.replace("@", "")
                new_entry[new_key] = entry[key] if entry[key] else ""
                del new_key
            data.append(new_entry)
            del new_entry

        # Return JSON response
        return JSONResponse(content=data)
    except Exception as e:
        return JSONResponse(content={"error": str(e)})


# Register to be called when the program is exiting
atexit.register(exit_handler)

scheduler_thread = Thread(target=run_scheduler)
scheduler_thread.start()

if __name__ == "__main__":
    uvicorn.run(
        app, host=os.environ.get("HOST", "0.0.0.0"), port=os.environ.get("PORT", 8000)
    )
