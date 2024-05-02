const express = require("express");
let router = express.Router();
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

//Route base/youtube
router.route("/getTitle").post(async (req, res) => {
  try {
    const videoUrl = req.body.link;
    if (!ytdl.validateURL) return res.status(500).send("Not a valid link!");
    const info = await ytdl.getInfo(videoUrl);

    const title = info.videoDetails.title;

    res.status(200).send(title);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

router.route("/downloadVideo").post(async (req, res) => {
  try {
    const videoUrl = req.body.link;

    if (!ytdl.validateURL(videoUrl))
      return res.status(500).send("Invalid URL!");

    const options = {
      quality: "highestvideo",
      filter: "videoandaudio",
    };
    const info = await ytdl.getInfo(videoUrl); //query youtube video info

    const title = info.videoDetails.title;

    const videoPath = path.join(__dirname, "temp", `${title}.mp4`);
    const videoWriteStream = fs.createWriteStream(videoPath);
    ytdl(videoUrl, options).pipe(videoWriteStream);

    videoWriteStream.on("finish", () => {
      res.download(videoPath, `${title}.mp4`, () => {
        fs.unlinkSync(videoPath); //Delete our video once in downloaded.
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
