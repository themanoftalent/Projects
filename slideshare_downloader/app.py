import os
from flask import Flask, render_template, request, send_from_directory
import requests
import re
import json
from fpdf import FPDF

app = Flask(__name__)
DOWNLOAD_FOLDER = os.path.join(os.getcwd(), 'downloads')
app.config['DOWNLOAD_FOLDER'] = DOWNLOAD_FOLDER


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/download', methods=['POST'])
def download():
    url = request.form['url']
    response = requests.get(url)

    if response.status_code == 200:
        data = response.text
        slide_images_data = re.search(r'"slideImages":\[\s*(.*?)\s*\]', data, re.DOTALL)
        if slide_images_data:
            slide_images_text = slide_images_data.group(1)
            slide_images_text = "[" + slide_images_text + "]"
            slide_images = json.loads(slide_images_text)
            os.makedirs(os.path.join(app.config['DOWNLOAD_FOLDER'], 'slides'),
                        exist_ok=True)
            for idx, image in enumerate(slide_images):
                image_url = image.get("baseUrl")
                if image_url:
                    image_filename = f"slide_{idx + 1}.jpg"
                    image_path = os.path.join(app.config['DOWNLOAD_FOLDER'], 'slides', image_filename)
                    with open(image_path, "wb") as f:
                        f.write(requests.get(image_url).content)
                        print(f"{image_filename} indirildi.")

            pdf_path = os.path.join(app.config['DOWNLOAD_FOLDER'], 'slides', 'output.pdf')
            images_to_pdf(os.path.join(app.config['DOWNLOAD_FOLDER'], 'slides'), pdf_path)

            return send_from_directory(os.path.join(app.config['DOWNLOAD_FOLDER'], 'slides'), 'output.pdf',
                                       as_attachment=True)
        else:
            return 'slideImages bulunamadı.'
    else:
        return f'Sayfa yüklenirken bir hata oluştu: {response.status_code}'


def images_to_pdf(folder_path, pdf_path):
    pdf = FPDF()
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".jpg") or file.endswith(".jpeg") or file.endswith(".png"):
                image_path = os.path.join(root, file)
                pdf.add_page()
                pdf.image(image_path, 0, 0, 210, 297)  # A4 boyutunda
    pdf.output(pdf_path, "F")


if __name__ == '__main__':
    app.run(debug=True)
