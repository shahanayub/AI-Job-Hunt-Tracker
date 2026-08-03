const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

// Stores the latest uploaded resume text
let latestResumeText = "";

router.post("/upload", upload.single("resume"), async (req, res) => {

  try {

    const dataBuffer = fs.readFileSync(req.file.path);

    const pdf = await pdfParse(dataBuffer);

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