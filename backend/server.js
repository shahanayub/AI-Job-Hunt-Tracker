require('dotenv').config()

const scrapeGoogle = require("./scrapers/googlejobs");
const scrapeLinkedIn = require("./scrapers/linkedinjobs");

const Job = require("./models/Job");

const resumeRoutes = require("./routes/resume");

const { analyzeResume } = require("./ai/gemini");

const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')

const app = express()

app.use(cors())
app.use(express.json())
app.use("/resume", resumeRoutes);

const PORT = 5000

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err))

app.get('/', (req, res) => {
  res.send("Backend is running!")
})

app.get("/jobs", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

app.post("/jobs", async (req, res) => {

  const job = await Job.create({
    company: req.body.company,
    position: req.body.position,
    description: req.body.description || "",
    url: req.body.url || "",
    status: req.body.status || "Applied",
    notes: req.body.notes || "",
    followUpDate: req.body.followUpDate || null,
    matchScore: req.body.matchScore || 0,
    statusHistory: [
      {
        status: req.body.status || "Applied",
      },
    ],
  });

  res.json(job);

});

app.delete("/jobs/:id", async (req, res) => {

  await Job.findByIdAndDelete(req.params.id);

  res.json({
    message: "Job deleted successfully",
  });

});

app.put("/jobs/:id", async (req, res) => {

  const oldJob = await Job.findById(req.params.id);

  if (!oldJob) {
    return res.status(404).json({
      message: "Job not found",
    });
  }

  const history = oldJob.statusHistory;

  if (oldJob.status !== req.body.status) {
    history.push({
      status: req.body.status,
    });
  }

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    {
      company: req.body.company,
      position: req.body.position,
      description: req.body.description,
      url: req.body.url,
      status: req.body.status,
      notes: req.body.notes,
      followUpDate: req.body.followUpDate,
      matchScore: req.body.matchScore,
      statusHistory: history,
    },
    {
      new: true,
    }
  );

  res.json(updatedJob);

});

app.post("/scrape", async (req, res) => {

  try {

    const { url } = req.body;

    let job;

    if (url.includes("google.com")) {
      job = await scrapeGoogle(url);
    }

    else if (url.includes("linkedin.com")) {
      job = await scrapeLinkedIn(url);
    }

    else {
      return res.status(400).json({
        message: "Unsupported website",
      });
    }

    res.json(job);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Scraping failed",
    });

  }

});

app.post("/analyze", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "Missing resume or job description.",
      });
    }

    const rawResult = await analyzeResume(resumeText, jobDescription);

    res.json({
      result: JSON.parse(rawResult), // Parse the string into a clean JSON object
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gemini analysis failed.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});