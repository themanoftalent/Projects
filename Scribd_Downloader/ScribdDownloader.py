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

class ScribdDownloader:
    def __init__(self):
        # Initializing Chrome service & options
        self.service = Service(ChromeDriverManager().install())
        self.options = webdriver.ChromeOptions()
        # Hiding Chrome & disabling logs
        self.options.add_argument('--headless')
        self.options.add_argument('--log-level=3')
        self.options.add_argument('--window-size=1600,2020')
        self.driver = None

    # Validating URLs
    def is_valid_url(self, url):
        return bool(re.match(r'^https://www\.scribd\.com/.*/\d+/.*', url))

    # Extracting document name from URL
    def extract_document_name(self, url):
        match = re.search(r'/.*/\d+/(.*)$', url)
        document_name = match.group(1)
        return document_name.strip()

    def capture_document(self, url):
        # Checking if URL is valid
        if not self.is_valid_url(url):
            print("Please enter a valid Scribd document URL: https://www.scribd.com/...")
            sys.exit(1)

        document_name = self.extract_document_name(url)

        # Added the missing service here
        self.driver = webdriver.Chrome(options=self.options, service=self.service)
        self.driver.get(url)
        

        try:
            self.driver.implicitly_wait(1) 
            
            # Finding total number of pages
            try:
                total_pages_element = self.driver.find_element(By.CLASS_NAME, "page_of")
                total_pages = int(total_pages_element.text.split()[1])
            except NoSuchElementException:
                print("The provided URL does not contain a document.")
                sys.exit(1)

            # Entering fullscreen mode
            fullscreen_xpath = "//button[@aria-label='Fullscreen']"
            self.driver.find_element(By.XPATH, fullscreen_xpath).click()

            # Closing ads if present
            try:
                ads_xpath = "//button[@aria-label='Close']"
                self.driver.find_element(By.XPATH, ads_xpath).click()
            except NoSuchElementException:
                pass

            # Removing inbetween pages
            self.driver.execute_script("document.querySelectorAll('.between_page_portal_root').forEach(e => e.remove())")

            # Removing a specific div element that obscures the capturing process
            self.driver.execute_script("document.querySelector('div.GridContainer-module_wrapper_7Rx6L-._3-Y4VY.GridContainer-module_extended_fiqt9l').remove()")

            pages = []

            self.driver.execute_script("window.scrollBy(0, -100);")
            time.sleep(.1)

            for current in range(1, total_pages + 1):
                # Finding pages by id
                page = self.driver.find_element(By.XPATH, f"//div[@id='outer_page_{current}']")
                print(f"Capturing page: {current}/{total_pages}")
                self.driver.execute_script("arguments[0].scrollIntoView();", page)
                self.driver.execute_script("window.scrollBy(0, -86);")
                time.sleep(.1)

                # Capturing screenshot
                page_screenshot = page.screenshot_as_png
                screenshot_bytes = BytesIO(page_screenshot)
                screenshot_image = Image.open(screenshot_bytes)

                # Croping the screenshot to get the page only
                w, h = screenshot_image.size
                cropping_box = (0, 0, w - 4, h - 2)
                page_image = screenshot_image.crop(cropping_box)

                # Converting the page to RGB so img2pdf doesn't cry about existing alpha channels every time
                page_image = page_image.convert("RGB")

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
            print(f"File Saved as {document_name}.pdf")

        finally:
            # Exit Chrome
            self.driver.quit()
            print("Exiting...")


def main():
    # Getting URL from the command line
    if len(sys.argv) != 2:
        print("How To Use: python Scribd2Pdf.py [url]")
        sys.exit(1)

    url = sys.argv[1]

    # creating a new ScribdDownloader instance
    downloader = ScribdDownloader()
    downloader.capture_document(url)

if __name__ == "__main__":
    main()