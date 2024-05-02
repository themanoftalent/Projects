# SlideShare Downloader

SlideShare Downloader is a web application developed with Next.js and Node.js that enables users to download presentations from SlideShare. SlideShare is a platform for sharing presentations, documents, and professional content. This application provides a user-friendly interface for downloading presentations in various formats for offline viewing or archival purposes.

## Features
- **Web Interface**: Access the application through a web browser for easy interaction.
- **Simple Download Process**: Download presentations with a few clicks.
- **No Login Required**: Users can download presentations without needing to create an account or log in to SlideShare.
- **Multiple Formats Supported**: Presentations can be downloaded in various formats, including PDF.

## Installation
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/olcayhan/slideshare-downloader.git
   ```

2. Navigate to the project directory:
   ```bash
   cd slideshare-downloader
   ```

3. Install dependencies for both the Next.js frontend and the Node.js backend:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

## Usage
1. Start the backend server:
   ```bash
   cd backend
   node index.js
   ```

2. Start the Next.js frontend server:
   ```bash
   cd ../frontend
   npm run dev
   ```

3. Open your web browser and navigate to `http://localhost:3000` to access the SlideShare Downloader application.

4. Enter the SlideShare URL of the presentation you want to download and follow the on-screen instructions to complete the download process.

## Requirements
- Node.js
- npm (Node Package Manager)
- Next.js
- Express.js

## Disclaimer
This application is intended for personal and educational use only. Users should ensure they have the necessary permissions to download and use the presentations obtained through this application, respecting the copyrights and terms of use of the content on SlideShare.

## Contribution
Contributions to the project are welcome! If you encounter any issues, have suggestions for improvements, or would like to contribute code, feel free to open an issue or submit a pull request on GitHub.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.