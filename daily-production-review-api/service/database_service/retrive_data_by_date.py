from collections import deque
from datetime import datetime, timedelta
from http.client import HTTPException

import dateutil
import pymongo

from config.database import collection_name, db
from service.file_reader.read_excel_file import get_fields_for_a_date
from service.file_reader.text_file_service import *
from dateutil import parser


async def insert_into_db(input_excel_file_path):

    models_of_specific_date = get_fields_for_a_date(input_excel_file_path, "2023 Schedule")

    for value in models_of_specific_date:
        chassisNo_to_check = value[1]  # Assuming chassis number is in the second position (index 1)
        existing_entry =  collection_name.find_one({"chassisNo": chassisNo_to_check})

        if existing_entry is None:
            new_entry = {
                "date": value[0],
                "chassisNo": chassisNo_to_check,
                "model": value[2],
                "dealer": value[3],
                "stationNo": 0,
                "status": 0,
            }

            try:
                db[collection_name].insert_one(new_entry)
            except Exception as e:
                # Handle the exception, e.g., log the error
                print(f"Error inserting data: {e}")


# def get_data_of_first_station(date_str, file_path):
#     try:
#         total_jobs_processed = 0
#         all_target_docs = []
#
#         # Parse the input date string into a datetime object
#         target_date = parse_date_with_microseconds(date_str)
#         no_of_jobs_to_process = get_no_of_jobs_on_given_date(date_str, file_path)
#
#         # Create a deque to store the documents
#         queue_for_first_station = deque()
#
#         # Find documents for the target date and next day until the total number of jobs is reached
#         while total_jobs_processed < no_of_jobs_to_process:
#             cursor = collection_name.find({"date": target_date})
#
#             # Convert the cursor to a list
#             documents = list(cursor)
#
#             # Calculate how many documents can be added to the deque
#             remaining_jobs = no_of_jobs_to_process - total_jobs_processed
#             documents_to_add = min(remaining_jobs, len(documents))
#
#             for document in documents[:documents_to_add]:
#                 # Add only the required number of documents to the deque
#
#                 chassis_no = document.get("chassisNo")
#                 model = document.get("model")
#                 dealer_no = document.get("dealer")
#
#                 # Create a dictionary containing the specific fields
#                 specific_fields = {
#                     "chassisNo": chassis_no,
#                     "model": model,
#                     "dealer": dealer_no
#                 }
#                 queue_for_first_station.append(specific_fields)
#
#             total_jobs_processed += documents_to_add
#
#             if total_jobs_processed < no_of_jobs_to_process:
#                 target_date += timedelta(days=1)
#
#     except Exception as e:
#         return {"error": str(e)}
#
#     return queue_for_first_station

def get_data_for_given_date(date_str, file_path):
    try:
        all_target_docs = []

        # Parse the input date string into a datetime object
        target_date = parse_date_with_microseconds(date_str)

        # Find documents for the target date
        cursor = collection_name.find({"date": target_date})

        # Convert the cursor to a list
        documents = list(cursor)

        for document in documents:
            # Extract relevant information from the document
            chassis_no = document.get("chassisNo")
            model = document.get("model")
            dealer_no = document.get("dealer")

            # Create a dictionary containing the specific fields
            specific_fields = {
                "chassisNo": chassis_no,
                "model": model,
                "dealer": dealer_no
            }
            all_target_docs.append(specific_fields)

    except Exception as e:
        return {"error": str(e)}

    return all_target_docs


def get_no_of_jobs_on_given_date(date_str: str, file_path):
    target_date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%f%z")

    # Get the day name from the datetime object
    day_name = target_date.strftime("%A")

    values_in_settings = find_value_in_settings(file_path)
    no_of_jobs = find_value_of_given_key(values_in_settings, day_name)

    return no_of_jobs


def get_documents_by_station_no(station_no):
    try:
        # Define the query to find documents with the specified stationNo
        query = {"stationNo": station_no}

        result = collection_name.find(query)
        return list(result)
    except Exception as e:
        return {"error": str(e)}


def get_first_id_for_date(date_str):
    try:
        # Retrieve the records
        target_date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%f%z")
        first_document = collection_name.find_one({"date": target_date})
        if first_document:
            # Access the "id" field of the first document
            first_id = first_document.get("_id", None)

            if first_id is not None:
                return first_id
            else:
                return "No 'id' field found in the first document for the given date."
    except Exception as e:
        return {"error": str(e)}


def create_queue_of_records_with_ids_less_than(given_id, limit=16):
    try:
        # Query for records with IDs less than the given ID
        cursor = collection_name.find({"_id": {"$lt": given_id}}).sort([("_id", pymongo.DESCENDING)]).limit(limit)

        # Create a deque and add records to it
        record_queue = deque()
        for record in cursor:
            chassis_no = record.get("chassisNo")
            model = record.get("model")
            dealer_no = record.get("dealer")

            # Create a dictionary containing the specific fields
            specific_fields = {
                "chassisNo": chassis_no,
                "model": model,
                "dealer": dealer_no
            }

            record_queue.append(specific_fields)

        return record_queue
    except Exception as e:
        return {"error": str(e)}

def get_jobs_before_date(date):
    # Filter the jobs to get only the ones before the given date
    filter_query = {"date": {"$lt": date}}

    # Sort the jobs by their created_at date in descending order
    sort_query = [("date", -1)]

    # Get the jobs from the database
    jobs = collection_name.find(filter_query, sort=sort_query)
    return jobs



def get_previous_date(given_date_str):
    # Parse the given date string with microseconds
    given_date = parse_date_with_microseconds(given_date_str)

    # Find the immediate previous date
    previous_date_document = collection_name.find_one(
        {"date": {"$lt": given_date}},
        sort=[("date", -1)]
    )

    if previous_date_document:
        return previous_date_document["date"].strftime('%Y-%m-%dT%H:%M:%S.%f+00:00')
    else:
        return None


def parse_date_with_microseconds(date_str):
    try:
        # Try parsing the date string with microseconds
        return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%f%z")
    except ValueError:
        # If parsing fails, try parsing without microseconds
        return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S%z")