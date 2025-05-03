import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time

def check_whatsapp_numbers(numbers, task_id):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    registered, not_registered = [], []

    for num in numbers:
        driver.get(f"https://wa.me/{num}")
        time.sleep(5)
        if "invalid" in driver.page_source.lower():
            not_registered.append(num)
        else:
            registered.append(num)

    driver.quit()
    
    df = pd.DataFrame({
        "Registered": pd.Series(registered),
        "Not Registered": pd.Series(not_registered)
    })
    output_path = f"/tmp/{task_id}.xlsx"
    df.to_excel(output_path, index=False)
    return output_path