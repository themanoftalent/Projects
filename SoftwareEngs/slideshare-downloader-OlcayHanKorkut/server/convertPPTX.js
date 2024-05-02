const axios = require("axios");
const PowerPoint = require("pptxgenjs");

async function convertImagetoPPTX(images) {
  try {
    const pptx = new PowerPoint();
    for (const resimURL of images) {
      const image = await downloadImage(resimURL.src);
      pptx
        .addSlide()
        .addImage({ data: image, x: 0, y: 0, w: "100%", h: "100%" });
    }
    return pptx.write("arraybuffer");
  } catch (error) {
    console.error("Hata:", error);
  }
}

async function downloadImage(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const base64Image = Buffer.from(response.data, "binary").toString("base64");
  return "data:image/jpeg;base64," + base64Image;
}

module.exports = convertImagetoPPTX;
