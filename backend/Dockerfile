# Use the official Python image as a base image
FROM python:3.10-slim

# Install necessary utilities like curl and unzip
RUN apt-get update && apt-get install -y curl unzip

# Set the working directory inside the container
WORKDIR /app


# Copy the current directory contents into the container at /app
COPY . /app

# Install the dependencies from requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8000 for the FastAPI app
EXPOSE 8000

# Command to run the FastAPI app using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
