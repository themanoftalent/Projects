# Slideshare Downloader

**Slideshare Downloader** is a web application that allows users to download PowerPoint presentations from Slideshare.net. The application is built with Laravel, and Livewire to provide a seamless and interactive user experience.

## Demo

the demo of this application at: [https://slideshare.maviism.com](https://slideshare.maviism.com)

## Project Repository

https://github.com/maviism/slideshare-downloader

**sorry if i'm not put repository here. that can be easy for me if is there any changes 

## Lesson Learned

* i tried using vanilla javasript with fetch() function  (clientside)

    * there is cors issues when fetch slideshare link
    * when use cors mode 
    "Redirect has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header' "
    * when use no-cors mode return blank
    When you use mode: 'no-cors' in a fetch request, you may encounter limitations in the data you can access. This mode can be used to avoid CORS errors, but it restricts your ability to inspect the response headers or access the response body. (ChatGPT)

    there's solution to handle
    1. Server-Side Request(i choose this approach)
    2. Use a Public API or Create own(have seen this way https://github.com/Rob--W/cors-anywhere)
    3. Allow CORS on the Server(cannot be implement cause im not slideshare owner XD)

* choosing php cause have familiar with laravel framework
    * stuck when scrape img src data cause have img lazyloader behaviour(my assumsi) just return first img src and another base64 data
    * looking Repo Fevzi for references (thanks to you)
    * get cdn image link and increment filename for images url
    * learn to use PHPPresentation

    * issue
        * if there is pattern change in cdn link or html tree there will be an issue

* deploy in shared hosting(have do this before, there is no problem)


  
