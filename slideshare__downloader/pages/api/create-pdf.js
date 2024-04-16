import { createCanvas, loadImage } from "canvas";
import { PDFDocument } from "pdf-lib";
import { promisify } from "util";
import { Readable } from "stream";

const pipeline = promisify(require("stream").pipeline);

export default async function handler(req, res) {
  try {
    const urls = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: "Invalid or empty URLs array" });
    }

    const pdfDoc = await PDFDocument.create();

    for (const url of urls) {
      const image = await loadImage(url);
      const page = pdfDoc.addPage([image.width, image.height]);
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);

      const pdfImage = await pdfDoc.embedPng(canvas.toBuffer());
      page.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfStream = new Readable();
    pdfStream.push(pdfBytes);
    pdfStream.push(null);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="images.pdf"');
    await pipeline(pdfStream, res);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
}
