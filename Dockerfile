# Use official Python image
FROM python:3.9-slim-bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    unzip \
    && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Install ChromeDriver with robust version detection
RUN apt-get update && apt-get install -y jq \
    && CHROME_VERSION=$(google-chrome --version | awk '{print $3}') \
    && CHROME_MAJOR_VERSION=${CHROME_VERSION%%.*} \
    && CHROME_DRIVER_VERSION=$(curl -sSL "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROME_MAJOR_VERSION") \
    && echo "Installing ChromeDriver $CHROME_DRIVER_VERSION for Chrome $CHROME_VERSION" \
    && curl -sSL --retry 3 --retry-delay 5 "https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip" -o chromedriver.zip \
    && unzip -q chromedriver.zip \
    && mv chromedriver /usr/local/bin/ \
    && rm chromedriver.zip \
    && apt-get purge -y jq \
    && rm -rf /var/lib/apt/lists/*

# Install essential runtime dependencies
RUN apt-get update && apt-get install -y \
    libgconf-2-4 \
    fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
