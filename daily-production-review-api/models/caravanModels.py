from datetime import datetime

from pydantic import BaseModel

class Model(BaseModel):
    date: datetime
    chassisNo: str
    model: str
    dealer: str
    stationNo: int
    status: int

class UploadRequest(BaseModel):
    main_line_settings_folder_path: str
    main_l_settings_file_name: str
    input_excel_folder_path: str
    excel_file_name: str

