
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

let latestResumeText = "";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

// Stores the latest uploaded resume text


router.post("/upload", upload.single("resume"), async (req, res) => {

  try {

    const dataBuffer = fs.readFileSync(req.file.path);

    const pdf = await pdfParse(dataBuffer);
    latestResumeText = pdf.text;

    console.log("Resume uploaded!");
console.log("Characters:", pdf.text.length);


    fs.unlinkSync(req.file.path);

    latestResumeText = pdf.text;

    res.json({
      text: latestResumeText,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to process resume",
    });

  }

});

// Returns the latest uploaded resume
router.get("/latest", (req, res) => {

  res.json({
    text: latestResumeText,
  });

});

module.exports = router;