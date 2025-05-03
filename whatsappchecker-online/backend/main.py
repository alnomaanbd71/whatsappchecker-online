from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import pandas as pd
import uuid
from worker import check_whatsapp_numbers

app = FastAPI()

@app.post("/api/check")
async def check(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    numbers = df['phone'].astype(str).tolist()
    task_id = str(uuid.uuid4())
    output_path = check_whatsapp_numbers(numbers, task_id)
    return {"download_url": f"/download/{task_id}"}

@app.get("/download/{task_id}")
def download(task_id: str):
    return FileResponse(path=f"/tmp/{task_id}.xlsx", filename="result.xlsx")