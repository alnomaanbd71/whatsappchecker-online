# Dockerfile

# 1) Use Playwright’s Python image (bundles Python, headless Chromium & all deps)
FROM mcr.microsoft.com/playwright/python:latest

# 2) Set working directory
WORKDIR /app

# 3) Copy your application code into the container
COPY . .

# 4) Upgrade pip & install Python dependencies
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# 5) Expose the port your app listens on (Render will bind $PORT to this)
EXPOSE 5000

# 6) Run your Flask/FastAPI app; ensure main.py binds to $PORT
CMD ["python", "main.py"]
