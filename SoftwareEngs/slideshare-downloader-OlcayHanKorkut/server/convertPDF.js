const axios = require("axios");
const { jsPDF } = require("jspdf");

async function convertImagetoPdf(images) {
  const pdf = new jsPDF({orientation:"landscape"});
  for (const resimURL of images) {
    const img = await downloadImage(resimURL.src);
    pdf.addImage(img, "PNG", 0, 0, 297, 210);
    pdf.addPage();
  }
  return pdf.output("arraybuffer");
}

async function downloadImage(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const base64Image = Buffer.from(response.data, "binary").toString("base64");
  return "data:image/jpeg;base64," + base64Image;
}

module.exports = convertImagetoPdf;
