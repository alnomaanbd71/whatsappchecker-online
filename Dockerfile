FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget gnupg curl unzip \
    fonts-liberation libnss3 libxss1 libxi6 libx11-xcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxrandr2 \
    libxtst6 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libpangocairo-1.0-0 libcairo2 \
    xdg-utils xvfb x11-xauth \
    && rm -rf /var/lib/apt/lists/*

# Set display environment variable for headless operation
ENV DISPLAY=:99

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . /app
WORKDIR /app

# Expose default port (change if needed)
EXPOSE 8000

# Start FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
