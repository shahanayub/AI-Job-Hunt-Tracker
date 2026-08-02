const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/upload", upload.single("resume"), async (req, res) => {

  try {

    const dataBuffer = fs.readFileSync(req.file.path);

    const pdf = await pdfParse(dataBuffer);

    fs.unlinkSync(req.file.path);

    res.json({
      text: pdf.text,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to process resume",
    });

  }

});

module.exports = router;