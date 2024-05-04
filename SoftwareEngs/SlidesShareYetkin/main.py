import PySimpleGUI as psg
from downloader import download_from_slideshare

layout = [
    [psg.Text("Enter SlideShare link")],
    [psg.InputText(key="slide_url")],
    [psg.Button("Download")],
]

window = psg.Window("SlideShare Downloader", layout)

while True:
    event, values = window.read()

    if event == psg.WIN_CLOSED:
        break
    elif event == "Download":
        window["Download"].update(disabled=True)  # Disable the button to prevent multiple clicks
        try:
            # Try downloading the slides
            download_from_slideshare(values["slide_url"])
            # If successful, show a success pop-up
            psg.popup("Download Successful", "Your PDF has been successfully downloaded.")
        except Exception as e:
            # If there's an error, show an error pop-up
            psg.popup_error("Download Failed", f"An error occurred: {e}")
        finally:
            window["Download"].update(disabled=False)  # Re-enable the button after download

window.close()