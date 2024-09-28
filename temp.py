from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os

app = FastAPI()

# Create a directory to store uploaded files if it doesn't exist
UPLOAD_DIR = "images"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# add some temporary text

@app.get("/")
async def read_root():
    return {"message": "Hello World"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if file.content_type != 'image/jpeg':
            return JSONResponse(status_code=400, content={"message": "Invalid file type. Only JPEG images are accepted."})
        
        file_location = os.path.join(UPLOAD_DIR, file.filename)
    
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())
        
        return JSONResponse(status_code=200, content={"message": "File uploaded successfully", "filename": file.filename})
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "File upload failed", "error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 