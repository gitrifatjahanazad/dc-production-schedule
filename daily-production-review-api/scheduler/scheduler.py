import os
import time
import requests
import schedule
import logging
from pytz import utc
from datetime import datetime

def log_init():
    ensure_directory(log_path)
    starting_time = datetime.now(utc).timestamp()
    log_file = os.path.join(log_path, f"scheduler-{starting_time}.log")
    # Configure logging to write to both console and a log file
    log_format = "%(asctime)s [%(levelname)s] - %(message)s"
    logging.basicConfig(
        level=logging.DEBUG,  # Set the logging level (adjust as needed)
        format=log_format,
        handlers=[
            logging.StreamHandler(),  # Output log messages to console
            logging.FileHandler(log_file)  # Output log messages to a file
        ]
    )

    # # Example usage of logging
    # logging.info("This is an info message.")
    # logging.warning("This is a warning message.")
    # logging.error("This is an error message.")


scheduler_result_path = "./scheduler_result"
log_path = "./log"

def ensure_directory(directory_path='./scheduler_result'):
    # Check if the directory already exists
    if not os.path.exists(directory_path):
        # If it doesn't exist, create it
        os.makedirs(directory_path)

def make_api_call_and_save_response():
    # Replace this URL with the actual API endpoint you want to call
    api_url = "https://orders.crusadercaravans.com.au/ScheduleFeed.asmx"

    # Define custom headers as a dictionary
    headers = {
        "Content-Type": "text/xml",  # Set the content type to XML
        "SOAPAction": "http://orders.crusadercaravans.com.au/GetScheduleAsXml"     # Add any other custom headers as needed
    }

    # Define the XML request body as a string
    xml_body = """<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetScheduleAsXml xmlns="http://orders.crusadercaravans.com.au/">
      <Username>api</Username>
      <Password>GfHJ34</Password>
    </GetScheduleAsXml>
  </soap:Body>
</soap:Envelope>
    """

    # Make the POST request with headers and XML body
    response = requests.post(api_url, headers=headers, data=xml_body)
    
    if response.status_code == 200:
        logging.info("API call successful")
        
        # Get the current UTC date-time in ISO format
        timestamp = datetime.now(utc).isoformat()
        
        # Format the timestamp to make it filename-friendly
        formatted_timestamp = timestamp.replace(":", "-").replace(".", "-")
        
        # Create a filename with the timestamp
        filename = f"api_response_{formatted_timestamp}.xml"
        filename = os.path.join(scheduler_result_path, filename)
        
        # Save the response content to the filename
        with open(filename, "w") as file:
            file.write(response.text)
            
        logging.info(f"API response saved to {filename}")
    else:
        logging.error(f"API call failed with status code {response.status_code}")

def job():
    logging.info(f"Running the API call job...")
    make_api_call_and_save_response()

if __name__ == "__main__":
    log_init()
    ensure_directory(scheduler_result_path)
    # Schedule the job to run every 5 minutes
    schedule.every(1).minutes.do(job)
    starting_time = datetime.now(utc).isoformat()
    logging.info(f"Scheduler started...")

    # make_api_call_and_save_response() # quick call check
    # Run the scheduler indefinitely
    while True:
        schedule.run_pending()
        time.sleep(1)
