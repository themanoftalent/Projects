import sys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from io import BytesIO
from PIL import Image
import time
import img2pdf

# Initializing chrome WebDriver
service = Service(ChromeDriverManager().install())

# URL of the document
# url = "https://www.scribd.com/document/90403141/Social-Media-Strategy"

# Getting URL from the command line
if len(sys.argv) != 2:
    print("How To Use: python Scribd2Pdf.py [url]")
    sys.exit(1)

url = sys.argv[1]


options = webdriver.ChromeOptions()
# Hiding chrome
options.add_argument('--headless')
# Disabling logs
options.add_argument('--log-level=3')
options.add_argument("--window-size=1600,2020")
driver = webdriver.Chrome(options=options)
driver.get(url)

try:
    driver.implicitly_wait(1) 
    
    # Finding total number of pages
    total_pages_element = driver.find_element(By.CLASS_NAME, "page_of")
    #print(total_pages_element)

    # Getting integer
    total_pages = int(total_pages_element.text.split()[1])

    # Finding fullscreen button
    fullscreen_xpath = "//button[@aria-label='Fullscreen']"
    driver.find_element(By.XPATH, fullscreen_xpath).click()
    #print("Fullscreen")

    # Finding and removing ads
    try:
        ads_xpath = "//button[@aria-label='Close']"
        driver.find_element(By.XPATH, ads_xpath).click()
    except NoSuchElementException:
        print("This page does not contain ads")
    
    #print("Ad closed")
    driver.execute_script("document.querySelectorAll('.between_page_portal_root').forEach(e => e.remove())")
    #print("Removed ads")
    #time.sleep(2)

    pages = []

    driver.execute_script("window.scrollBy(0, -100);")
    time.sleep(.1)

    
    for current in range(1, total_pages + 1):
        # Finding pages by id
        page = driver.find_element(By.XPATH, "//div[@id='outer_page_{}']".format(current))
        print("Capturing page: {}/{}".format(current,total_pages))
        driver.execute_script("arguments[0].scrollIntoView();", page)
        driver.execute_script("window.scrollBy(0, -86);")
        time.sleep(.1)

        # Capturing screenshot
        page_screenshot = page.screenshot_as_png
        screenshot_bytes = BytesIO(page_screenshot)
        screenshot_image = Image.open(screenshot_bytes)

        # Saving screenshot
        # screenshot_image.save(f"screenshot_page_{current}.png")

        # Croping the screenshot to get the page only
        w, h = screenshot_image.size
        cropping_box = (0, 0, w - 1, h)
        page_image = screenshot_image.crop(cropping_box)

        # Saving cropped screenshot
        # page_image.save(f"cropped_page_{current}.png")

        # Converting the cropped image to bytes and saving it
        img_byte_array = BytesIO()
        page_image.save(img_byte_array, format='PNG')
        pages.append(img_byte_array.getvalue())

    # Image to Pdf
    pdf_bytes = img2pdf.convert(pages)

finally:
    # Exit chrome
    driver.quit()

    # Saving file
    filename = 'Result.pdf'
    with open(filename, 'wb') as file:
        file.write(pdf_bytes)
    print("File Saved")