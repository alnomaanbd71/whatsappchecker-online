# Dockerfile

# 1. Use Playwright’s Python image (includes headless Chromium & libs)
FROM mcr.microsoft.com/playwright/python:1.44.0-focal

# 2. Set working directory
WORKDIR /app

# 3. Copy application code
COPY . /app

# 4. Install Python dependencies
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# 5. Expose your app’s port
EXPOSE 5000

# 6. Start the Flask/FastAPI app
CMD ["python", "main.py"]
