# Scribd Downloader

## Installation

Use the package manager pip to install the following packages.

```bash
pip install selenium webdriver-manager Pillow img2pdf
```

## Usage

Run the script using the provided syntax:

```bash
python ScribdDownloader.py [URL]
```

Example:

```bash
python ScribdDownloader.py https://www.scribd.com/document/90403141/Social-Media-Strategy
```

## Latest Changes

- Refactored The code into a more structured format.
- Created a class called ScribdDownloader.
- Moved the old functions into the ScribdDownloader class as methods.
- Created a method called capture_document to handle the entire process of capturing the Scribd document and converting it to PDF.
- Refactored the main part of the script into the main function.
- Added the missing service when initializing the Chrome webdriver.
- Added the `__name__ == "__main__"` condition so that the main function is executed if the script is run directly.
