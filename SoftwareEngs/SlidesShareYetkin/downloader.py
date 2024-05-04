import requests, bs4
from PIL import Image
from io import BytesIO
import re

# Input URL Format
# https://www.slideshare.net/slideshow/cross-validationpptx/260861751
def download_from_slideshare(url:str):
    # get page contents
    res = requests.get(url)

    # build soup
    soup = bs4.BeautifulSoup(res.content, "html.parser")

    # get title (sanitize to remove invalid characters)
    raw_title = soup.find("title").text.split(".")[0]
    # Only allow alphanumeric characters, underscores, and hyphens in the title
    title = re.sub(r"[^\w\s-]", "", raw_title).strip().replace(" ", "_")

    # collect images
    images = soup.find_all("img", {"class": "vertical-slide-image"})

    # get first image's URL and set count
    base_url = images[0]["srcset"].split(" ")[-2]
    count = len(images)

    # generate all image URLs
    urls = [base_url.replace("-1-", f"-{i+1}-") for i in range(count)]

    # download all images and put in a list
    image_srcs = [BytesIO(requests.get(url).content) for url in urls]

    # open all downloaded images
    images = [Image.open(src) for src in image_srcs]

    # save all images to a PDF
    pdf_path = f"{title}.pdf"
    images[0].save(pdf_path, resolution=100.0, save_all=True, append_images=images[1:])

    return pdf_path  # Optional: Return the path of the saved PDF