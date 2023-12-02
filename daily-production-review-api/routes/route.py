import os


from click import File
from fastapi import APIRouter, UploadFile
from starlette.responses import JSONResponse
from urllib.parse import quote

from service.file_reader.text_file_service import extract_job_progress_time_from_text_file, read_response_from_file
from service.services import insert_data_to_db


router = APIRouter()
text_file_content = ""


@router.get("/main-line-status")
async def upload_route():
    from main import main_settings_File_path
    # Read response.txt file
    response_content = read_response_from_file()
    interval_in_min = extract_job_progress_time_from_text_file(main_settings_File_path)
    interval = interval_in_min * 60 * 1000
    print(response_content)
    return {"interval": interval, "response_content": response_content}


@router.post("/upload-file")
async def upload_file(file_upload: UploadFile = File(...)):
    from main import current_directory
    data = await file_upload.read()
    save_to_excel_file_path = os.path.join(current_directory, file_upload.filename)

    with open(save_to_excel_file_path, "wb") as new_file:
        new_file.write(data)
    print("------------------")
    await insert_data_to_db(save_to_excel_file_path)

    print(save_to_excel_file_path)
    return {"filename": file_upload.filename}

main_file_path = os.path.abspath('__main__')
main_file_path = os.path.dirname(main_file_path)
output_folder = os.path.join(main_file_path, "outputDirectory")


@router.get("/files")
def get_files():
    try:
        files = os.listdir(output_folder)
        print(files)
        return files
    except Exception as e:
        return {"error": str(e)}

@router.get("/get-files")
async def get_files():
    folder_path = output_folder
    try:
        files = [
            {
                'name': file,
                'url': f'/api/download/{quote(file)}'  # URL-encode the file name
            }
            for file in os.listdir(folder_path)
        ]
        print(files)
        return JSONResponse(content={'files': files})
    except Exception as e:
        return JSONResponse(content={'error': str(e)}, status_code=500)