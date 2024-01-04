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

def make_api_call(api_url, xml_body, soap_action, filename_prefix):
    headers = {
        "Content-Type": "text/xml",
        "SOAPAction":  soap_action     # Add any other custom headers as needed
    }

    response = requests.post(api_url, headers=headers, data=xml_body)

    if response.status_code == 200:
        logging.info("API call successful")

        timestamp = datetime.now(utc).isoformat()
        formatted_timestamp = timestamp.replace(":", "-").replace(".", "-")

        filename = f"{filename_prefix}_{formatted_timestamp}.xml"
        filename = os.path.join(scheduler_result_path, filename)

        with open(filename, "w") as file:
            file.write(response.text)

        logging.info(f"API response saved to {filename}")
    else:
        logging.error(f"API call failed with status code {response.status_code}")

def call_apis():
    api_url = "https://orders.crusadercaravans.com.au/ScheduleFeed.asmx"
    api_url2 = "https://orders.crusadercaravans.com.au/ScheduleFeed.asmx"
    api_url3 = "https://orders.crusadercaravans.com.au/ScheduleFeed.asmx"

    soap_action_schedule_feed= "http://orders.crusadercaravans.com.au/GetScheduleAsXml"
    soap_action_schedule_options= "http://orders.crusadercaravans.com.au/GetScheduleOptionsAsXml"
    soap_action_schedule_variations= "http://orders.crusadercaravans.com.au/GetScheduleVariationsAsXml"

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
    xml_body2 = """<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetScheduleOptionsAsXml xmlns="http://orders.crusadercaravans.com.au/">
      <Username>api</Username>
      <Password>GfHJ34</Password>
    </GetScheduleOptionsAsXml>
  </soap:Body>
</soap:Envelope>
          """
    xml_body3 = """<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetScheduleVariationsAsXml xmlns="http://orders.crusadercaravans.com.au/">
      <Username>api</Username>
      <Password>GfHJ34</Password>
    </GetScheduleVariationsAsXml>
  </soap:Body>
</soap:Envelope>
          """

    make_api_call(api_url, xml_body, soap_action_schedule_feed,"api_response")
    make_api_call(api_url2, xml_body2, soap_action_schedule_options,"schedule_options")
    make_api_call(api_url3, xml_body3, soap_action_schedule_variations,"schedule_variations")


def job():
    logging.info(f"Running the API call job...")
    call_apis()

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
