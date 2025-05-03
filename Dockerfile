# Dockerfile

# 1) Use Playwright’s Python image (includes Python, headless Chromium & deps)
FROM mcr.microsoft.com/playwright/python:latest

# 2) Set working directory
WORKDIR /app

# 3) Copy your entire app into the container
COPY . .

# 4) Upgrade pip & install Python dependencies
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# 5) Expose the port your app listens on
EXPOSE 5000

# 6) Command to run your Flask/FastAPI app
#    Ensure your main.py binds to $PORT (default 5000)
CMD ["python", "main.py"]
