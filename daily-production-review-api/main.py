import atexit
import datetime
import os
import ssl
import threading
import time
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import schedule
import uvicorn
import xmltodict
from fastapi import FastAPI, Depends, HTTPException, Form, UploadFile, File
from fastapi.responses import JSONResponse
from pymongo import collection
from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_microsoft_identity import requires_auth, get_token_claims, initialize
from datetime import timedelta
from typing import Annotated
from threading import Thread, Event
from starlette.responses import HTMLResponse

from config.database import collection_remarks_name, db
from starlette.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import aiosmtplib

import smtplib
from email.message import EmailMessage
from pydantic import BaseModel, ValidationError, json
import xml.etree.ElementTree as ET

from routes.route import router
from service.file_reader.save_in_text_file import UpdateConfigurationInfo, formatText

from service.file_reader.text_file_service import (
    extract_job_progress_time_from_text_file,
    clear_response_file,
    get_file_save_time, read_text_file,
)
from service.merge_xml_as_json.convert_xml_to_json import xml_to_json
from service.merge_xml_as_json.merge_xml_files import merge_xml_files
from service.merge_xml_as_json.replace_xml_attribute import replace_attribute
from service.merge_xml_as_json.sort_all_files import get_latest_xml_files
from service.merge_xml_as_json.transform_merged_data import transform_data
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


class Remark(BaseModel):
    job_id: str
    remark: str


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
        keywords = ["api_response"]
        latest_files = get_latest_xml_files(keywords)
        latest_xml_file = max(
            xml_files,
            key=lambda file: os.path.getmtime(os.path.join(folder_path, file)),
        )

        # Construct the full path to the latest XML file
        xml_file_path = os.path.join(folder_path, latest_files.get('api_response', ''))
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

@app.get("/xml_to_json_merged")
async def convert_latest_xml_to_json_merged(query: str | None = None, page_num: int = 1, page_size: int = 10):
    try:
        folder_path = os.environ.get("XML_FOLDER_PATH", "./scheduler/scheduler_result")
        keywords = ["api_response", "schedule_options", "schedule_variations"]
        latest_files = get_latest_xml_files(keywords)

        api_response_file= os.path.join(folder_path, latest_files.get('api_response', ''))
        schedule_options_file = os.path.join(folder_path, latest_files.get('schedule_options', ''))
        schedule_variations_file =  os.path.join(folder_path, latest_files.get('schedule_variations', ''))
        # output = os.path.join(folder_path, "merged.xml")

        # Parse XML content from the files
        with open(schedule_options_file, 'r') as file:
            root2 = ET.fromstring(file.read())

        with open(schedule_variations_file, 'r') as file:
            root3 = ET.fromstring(file.read())

        with open(api_response_file, 'r') as file:
            root1 = ET.fromstring(file.read())

        # Replace JobID with jobiD in api_respnse
        root1 = replace_attribute(root1, "JobID", "jobid")

        merge_based_on = "productionno"
        merged_response_productionno = merge_xml_files(root2, root3, merge_based_on)

        merge_based_on = "jobid"
        merged_response_productionno = merge_xml_files(root1, merged_response_productionno, merge_based_on)

        converted_json = xml_to_json(merged_response_productionno)

        existing_data = converted_json.get("MergedResponse", {}).get("ScheduleOptionsVariations", [])

        transformed_data = transform_data(existing_data)

        # search
        filtered_data = []
        if query:
            for item in transformed_data:
                for value in item.values():
                    value = value.lower()
                    search_query = query.lower()
                    if search_query in value:
                        filtered_data.append(item)
        else:
            filtered_data = transformed_data

        # Pagination
        total_items = len(filtered_data)
        start_index = (page_num - 1) * page_size
        end_index = start_index + page_size
        paginated_data = filtered_data[start_index:end_index]

        return JSONResponse(content={"total_items": total_items, "page_num": page_num, "page_size": page_size, "data": paginated_data})

    except Exception as e:
        return JSONResponse(content={"error": str(e)})

# Register to be called when the program is exiting
atexit.register(exit_handler)

scheduler_thread = Thread(target=run_scheduler)
scheduler_thread.start()


@app.post("/save_remark")
async def save_remark(remark: Remark):
    try:
        # Try to update the existing document with the given job_id
        result = collection_remarks_name.update_one(
            {"job_id": remark.job_id},
            {"$set": {"remark": remark.remark}},
            upsert=True  # Create a new document if the job_id doesn't exist
        )

        if result.matched_count == 0 and result.upserted_id is not None:
            # If no document was matched (job_id doesn't exist), and a new document was upserted
            return {"message": "Job ID added with remark successfully"}
        else:
            # Document was matched and updated
            return {"message": "Remark saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving remark: {str(e)}")

@app.get("/get_remark/{job_id}")
async def get_remark(job_id: str):
    try:
        # Retrieve the remark from MongoDB based on job_id
        result = collection_remarks_name.find_one({"job_id": job_id}, {"_id": 0, "remark": 1})
        if result:
            return {"remark": result["remark"]}
        else:
            return {"remark": ""}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving remark: {str(e)}")

@app.get("/get_configuration_info")
async def get_production_info():
    production_info = read_text_file(main_settings_File_path)
    return JSONResponse(content=production_info)

@app.post("/update_configuration_info")
def update_configuration_info(data: UpdateConfigurationInfo):
    updated_data = data.dict()

    details = {
        'Monday: ' : updated_data['Monday'],
        'Tuesday: ': updated_data['Tuesday'],
        'Wednesday: ': updated_data['Wednesday'],
        'Thursday: ': updated_data['Thursday'],
        'Friday: ': updated_data['Friday'],
        'Job Progress per Station: ': updated_data['Job_Progress_per_Station'],
        'Wall prep = Start No. +': updated_data['Wall_prep_Start_No'],
        'Roofs = Floor & Lino Assembly': updated_data['Roofs_Floor_Lino_Assembly'],
        'Doors = Start No. -': updated_data['Doors_Start_No'],
        'Furniture = Start No. +': updated_data['Furniture_Start_No'],
        'CNC = Start No. +': updated_data['CNC_Start_No'],
        'Main Line Daily Production Schedule Excel Path:\n': updated_data[
            'Main_Line_Daily_Production_Schedule_Excel_Path'],
        'File save at: ': updated_data['File_save_at']
    }


    plain_text = ""
    for key, value in details.items():
        plain_text += f"{key.strip()} {value}\n"

    settings_text = formatText(plain_text)
    settings_text = settings_text.replace("Main Line Daily Production Schedule Excel Path:",
                                          "Main Line Daily Production Schedule Excel Path:\n")
    with open(main_settings_File_path, 'w') as file:
        file.write(settings_text)


def send_email(to_address: str, subject: str, body: str):
    sender_email = "projectxemailtest@gmail.com"
    receiver_email = to_address

    # Gmail SMTP server settings
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "projectxemailtest@gmail.com"  # sender email
    smtp_password = "djmzxyechoeblepl"  # app password

    # Create the MIME object
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = sender_email
    message["To"] = receiver_email

    # Attach the HTML content
    html_content = MIMEText(body, "html")
    message.attach(html_content)

    # Read the crusader logo
    with open('./emailTemplate/assets/crusader-logo.png', 'rb') as image_file:
        msgImage = MIMEImage(image_file.read())

    msgImage.add_header('Content-ID', '<image1>')
    message.attach(msgImage)

    # Attach the googleplay logo
    with open('./emailTemplate/assets/googleplay.png', 'rb') as image_file:
        msgImage = MIMEImage(image_file.read())
    msgImage.add_header('Content-ID', '<image2>')
    message.attach(msgImage)

    try:
        # Connect to the SMTP server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()

        # Log in to the Gmail account
        server.login(smtp_username, smtp_password)

        # Send the email
        server.sendmail(sender_email, receiver_email, message.as_string())

        # Disconnect from the SMTP server
        server.quit()

        print("Email sent successfully!")

    except Exception as e:
        print(f"Error sending email: {e}")

@app.post("/send-email/")
async def send_email_handler(to: str, subject: str, message: str):

    # Read the HTML template file
    template_path = "./emailTemplate/index.html"
    with open(template_path, "r") as file:
        html_template = file.read()

    # Send the email with the updated HTML content
    send_email(to, subject, html_template)

    return {"message": "Email sent successfully!"}

if __name__ == "__main__":
    uvicorn.run(
        app, host=os.environ.get("HOST", "0.0.0.0"), port=os.environ.get("PORT", 8000)
    )
