FROM python:3.10-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget gnupg xvfb x11-xauth fonts-liberation \
    libgconf-2-4 libnss3 libxss1 libxi6 libx11-xcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxrandr2 \
    libxtst6 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libpangocairo-1.0-0 libcairo2 libappindicator3-1 \
    xdg-utils unzip \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]