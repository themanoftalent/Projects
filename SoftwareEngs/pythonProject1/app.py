from flask import Flask, render_template, request, redirect, url_for
import requests
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO
import os
from fpdf import FPDF  # FPDF modülünü import edin

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        url = request.form['url']
        return redirect(url_for('download_images', url=url))
    return render_template('index.html')


@app.route('/download_images', methods=['GET'])
def download_images():
    url = request.args.get('url', '')

    # Eğer URL SlideShare'e ait değilse hata fırlat
    if 'slideshare.net' not in url:
        return render_template('error.html', message='Sadece SlideShare URL\'leri desteklenmektedir.')


    # Sayfayı indir
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Tüm img etiketlerini bul
    img_tags = soup.find_all('img')
    link = ""

    # Her bir img etiketinde srcset özelliğini kontrol et
    for img in img_tags:
        srcset = img.get('srcset')
        if srcset:
            # srcset içinde "2048" içeren linki bul
            links = srcset.split(',')
            for linko in links:
                if '2048' in linko.strip().split(' ')[0]:
                    link = linko.strip().split(' ')[0]

    # Verilen link
    new_links = []
    new_links.append(link)
    base_link = link[:-10]

    # Yeni linkleri oluştur ve listeye ekle
    for i in range(2, 50):
        new_link = f"{base_link}{i}-2048.jpg"
        new_links.append(new_link)

    # Yeni linkleri indir
    for i, new_link in enumerate(new_links):
        response = requests.get(new_link)
        if response.status_code == 200:  # İndirme başarılıysa
            try:
                image = Image.open(BytesIO(response.content))
                image.verify()
                image.save(f"static/image_{i}.jpg")
            except Exception as e:
                print(f"Hata: {e} - Link: {new_link}")
        else:
            break

    # Indirilen resimleri pdf yap
    pdf = FPDF()
    for i in range(len(new_links) - 1):
        try:
            pdf.add_page()
            pdf.image(f"static/image_{i}.jpg", 0, 0, 210, 297)  # A4 boyutunda
        except Exception as e:
            break

    pdf.output("static/output.pdf", "F")

    # İndirilen tüm resim dosyalarını sil
    for i in range(len(new_links) ):
        try:
            os.remove(f"static/image_{i}.jpg")
        except Exception as e:
            break

    return render_template('result.html')


if __name__ == '__main__':
    app.run(debug=True)
