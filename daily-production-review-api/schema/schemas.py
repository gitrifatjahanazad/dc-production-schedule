def individual_serial(model) -> dict:
    return {
        "id": str(model["_id"]),
        "date": model["_date"],
        "chassisNo": model["chassisNo"],
        "model": model["model"],
        "dealer": model["dealer"],
        "stationNo": model["stationNo"],
        "status": model["status"]
    }


def list_serial(models) -> list:
    return [individual_serial(model) for model in models]
