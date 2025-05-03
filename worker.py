import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time
import os

def check_whatsapp_numbers(numbers, task_id):
    # Create /tmp directory if not exists
    os.makedirs('/tmp', exist_ok=True)
    
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    service = Service(executable_path='/usr/local/bin/chromedriver')
    driver = webdriver.Chrome(service=service, options=options)
    
    registered, not_registered = [], []

    for num in numbers:
        try:
            driver.get(f"https://wa.me/{num}")
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            if "invalid phone number" in driver.page_source.lower():
                not_registered.append(num)
            else:
                registered.append(num)
        except TimeoutException:
            not_registered.append(num)
            continue

    driver.quit()
    
    df = pd.DataFrame({
        "Registered": pd.Series(registered),
        "Not Registered": pd.Series(not_registered)
    })
    output_path = f"/tmp/{task_id}.xlsx"
    df.to_excel(output_path, index=False)
    return output_path
