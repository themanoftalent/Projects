# Slideshare Downloader

**Slideshare Downloader** is a web application that allows users to download PowerPoint presentations from Slideshare.net. The application is built with Laravel and Livewire to provide a seamless and interactive user experience.

## Demo

You can access the demo of this application at: [https://slideshare.maviism.com](https://slideshare.maviism.com)

## Project Repository

The project repository is available on GitHub: [Slideshare Downloader Repository](https://github.com/maviism/slideshare-downloader)

## Stack

- [PHP](https://www.php.net/) require version 8.2^
- [Laravel 11](https://laravel.com/)
- [Livewire 3](https://livewire.laravel.com/)

### Lesson Learned

#### Using Vanilla JavaScript with Fetch() Function (Client-Side)

- Encountered CORS issues when fetching Slideshare links:
  - When using CORS mode: "Redirect has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header."
  - When using 'no-cors' mode: Returned blank.
- Solutions considered:
  1. Server-Side Request (Chosen approach)
  2. Using a Public API or Creating own (Explored alternative methods like https://github.com/Rob--W/cors-anywhere)
  3. Allowing CORS on the Server (Not feasible as I am not the Slideshare owner)

#### Choosing PHP Due to Familiarity with Laravel Framework

- Faced challenges when scraping image src data due to lazy loader behavior.
- Referenced Fevzi repository for guidance and appreciation(thank to you).
- Obtained CDN image links and incremented filename for image URLs.
- Learned to use PHPPresentation package.
- Potential issues:
  - Any pattern change in CDN image links or HTML tree may require reconfiguration.

#### Deployment on Shared Hosting

Deployed the application on shared hosting without encountering any issues.

## Created by

Muadz Izhharul Haq
201502208

