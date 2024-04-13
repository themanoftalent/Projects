import sys
import re
import time
from io import BytesIO
from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import img2pdf

# Validating URLs
def is_valid_url(url):
    return url.startswith("https://www.scribd.com/document/")

# Extracting document name from URL
def extract_document_name(url):
    match = re.search(r'/document/\d+/(.*)$', url)
    document_name = match.group(1)
    return document_name.strip()

# Getting URL from the command line
if len(sys.argv) != 2:
    print("How To Use: python Scribd2Pdf.py [url]")
    sys.exit(1)

url = sys.argv[1]

# Checking if URL is valid
if not is_valid_url(url):
    print("Please enter a valid Scribd document URL: https://www.scribd.com/document/...")
    sys.exit(1)

document_name = extract_document_name(url)

# Initializing Chrome WebDriver
service = Service(ChromeDriverManager().install())

options = webdriver.ChromeOptions()
# Hiding Chrome & disabling logs
options.add_argument('--headless')
options.add_argument('--log-level=3')
options.add_argument("--window-size=1600,2020")
driver = webdriver.Chrome(options=options)
driver.get(url)

try:
    driver.implicitly_wait(1) 
    
    # Finding total number of pages
    try:
        total_pages_element = driver.find_element(By.CLASS_NAME, "page_of")
        total_pages = int(total_pages_element.text.split()[1])
    except NoSuchElementException:
        print("The provided URL does not contain a document.")
        sys.exit(1)

    # Entering fullscreen mode
    fullscreen_xpath = "//button[@aria-label='Fullscreen']"
    driver.find_element(By.XPATH, fullscreen_xpath).click()

    # Closing ads if present
    try:
        ads_xpath = "//button[@aria-label='Close']"
        driver.find_element(By.XPATH, ads_xpath).click()
    except NoSuchElementException:
        pass

    # Removing inbetween pages
    driver.execute_script("document.querySelectorAll('.between_page_portal_root').forEach(e => e.remove())")

    # Removing a specific div element that obscures the capturing process
    driver.execute_script("document.querySelector('div.GridContainer-module_wrapper_7Rx6L-._3-Y4VY.GridContainer-module_extended_fiqt9l').remove()")

    pages = []

    driver.execute_script("window.scrollBy(0, -100);")
    time.sleep(.1)

    for current in range(1, total_pages + 1):
        # Finding pages by id
        page = driver.find_element(By.XPATH, f"//div[@id='outer_page_{current}']")
        print(f"Capturing page: {current}/{total_pages}")
        driver.execute_script("arguments[0].scrollIntoView();", page)
        driver.execute_script("window.scrollBy(0, -86);")
        time.sleep(.1)

        # Capturing screenshot
        page_screenshot = page.screenshot_as_png
        screenshot_bytes = BytesIO(page_screenshot)
        screenshot_image = Image.open(screenshot_bytes)

        # Croping the screenshot to get the page only
        w, h = screenshot_image.size
        cropping_box = (0, 0, w - 1, h - 1)
        page_image = screenshot_image.crop(cropping_box)

        # Converting the cropped image to bytes and saving it
        img_byte_array = BytesIO()
        page_image.save(img_byte_array, format='PNG')
        pages.append(img_byte_array.getvalue())

    # Image to Pdf
    pdf_bytes = img2pdf.convert(pages)

    # Saving file
    filename = f'{document_name}.pdf'
    with open(filename, 'wb') as file:
        file.write(pdf_bytes)
    print("File Saved.")

finally:
    # Exit Chrome
    driver.quit()
    print("Exiting...")
