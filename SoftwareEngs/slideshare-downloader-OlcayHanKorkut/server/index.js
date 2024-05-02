const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const scrapeWebsite = require("./scrapper");
const convertImagetoPdf = require("./convertPDF");
const convertImagetoPPTX = require("./convertPPTX");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

app.post("/api/scrape", async (req, res) => {
  try {
    const { url } = req.body;
    const data = await scrapeWebsite(url);
    res.json(data);
  } catch (e) {
    console.log(e);
  }
});

app.post("/api/pdfcon", async (req, res) => {
  try {
    const { images } = req.body;
    const data = await convertImagetoPdf(images);
    res.send(Buffer.from(data));
  } catch (e) {
    console.log(e);
  }
});
app.post("/api/pptxcon", async (req, res) => {
  try {
    const { images } = req.body;
    const data = await convertImagetoPPTX(images);
    res.send(Buffer.from(data));
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
