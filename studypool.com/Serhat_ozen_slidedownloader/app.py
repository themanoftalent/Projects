from flask import Flask, request, render_template, send_file
import requests
from urllib.parse import unquote
from io import BytesIO

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        url = request.form.get('url')
        if url:
            try:
                
                response = requests.get(url)
                response.raise_for_status()

                filename = unquote(url.split('/')[-1])

                
                file_content = BytesIO(response.content)

                
                return send_file(
                    file_content,
                    mimetype=response.headers.get('content-type'),
                    as_attachment=True,
                    download_name=filename 
                )
            except requests.exceptions.RequestException as e:
                return f"Dosya indirme başarısız: {str(e)}"
            except Exception as e:
                return f"Bir hata oluştu: {str(e)}"
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
