import queue

from config.database import collection_name
from service.services import queue_to_list


def update_status_and_station_st1(documents_to_update_status):
    # Convert the queue to a list
    documents = queue_to_list(documents_to_update_status)

    # Update the corresponding records in MongoDB
    for doc in documents:
        doc_id = doc['_id']
        update_data = {
            "$set": {
                "status": 1,
                "stationNo": 1
            }
        }
        collection_name.update_one({"_id": doc_id}, update_data)

    return documents
