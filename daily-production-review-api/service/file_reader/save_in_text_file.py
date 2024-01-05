from pydantic import BaseModel

class UpdateConfigurationInfo(BaseModel):
    Monday: str
    Tuesday: str
    Wednesday: str
    Thursday: str
    Friday: str
    Job_Progress_per_Station: str
    Wall_prep_Start_No: str
    Roofs_Floor_Lino_Assembly: str
    Doors_Start_No: str
    Furniture_Start_No: str
    CNC_Start_No: str
    Main_Line_Daily_Production_Schedule_Excel_Path: str
    File_save_at: str
    Items_per_page: str

def formatText(details):
    prepend_string = "Production target per day:"
    result_string = prepend_string + "\n" + details

    target_lines = ['Job Progress per Station: ', 'Wall prep = Start No. + ',
                    'Main Line Daily Production Schedule Excel Path:', 'File save at:',
                    'Items per page:']

    # Insert a new line before each target line
    for line in target_lines:
        result_string = result_string.replace(line, '\n' + line)

    return result_string
