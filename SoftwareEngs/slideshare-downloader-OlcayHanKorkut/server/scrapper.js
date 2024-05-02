const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const newArr = [];

    const pageTitle = $("#new-player").find("img");
    const newTitle = pageTitle[0].attribs.srcset.split(",");
    const urlCon = newTitle[2].split("1-2048");
    console.log(urlCon);
    pageTitle.map((index, element) => {
      newArr.push({
        src: `${urlCon[0]}${index + 1}-2048${urlCon[1]}`,
      });
    });
    return newArr;
  } catch (error) {
    console.error("Web scraping error:", error);
    return null;
  }
}

module.exports = scrapeWebsite;
