require('dotenv').config();

const scrapeGoogle = require("./scrapers/googlejobs");
const scrapeLinkedIn = require("./scrapers/linkedinjobs");

const Job = require("./models/Job");
const resumeRoutes = require("./routes/resume");
const { analyzeResume } = require("./ai/gemini");

const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const { google } = require("googleapis"); // Added Google APIs package

const app = express();

app.use(cors());
app.use(express.json());
app.use("/resume", resumeRoutes);

const PORT = process.env.PORT || 5000;

// Google OAuth2 Client Configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// In-memory token store (persists for server runtime)
let storedTokens = null;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send("Backend is running!");
});

// ==========================================
// GOOGLE OAUTH2 & GMAIL API ROUTES
// ==========================================

// 1. Generate Auth URL for frontend redirect
app.get("/api/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Ensures we receive a Refresh Token
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
  });
  res.json({ url: authUrl });
});

// 2. OAuth Callback Route to store OAuth tokens
app.get("/api/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    storedTokens = tokens;
    res.send("<h2>Authentication successful! You can close this window and return to the app.</h2>");
  } catch (error) {
    console.error("Error exchanging OAuth code:", error);
    res.status(500).send("Authentication failed");
  }
});

// 3. Send Email Programmatically via Gmail API
app.post("/api/send-email", async (req, res) => {
  const { to, subject, body } = req.body;

  if (!storedTokens) {
    return res.status(401).json({ error: "User not authenticated with Gmail" });
  }

  try {
    oauth2Client.setCredentials(storedTokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Format RFC 2822 standard email string
    const rawMessage = [
      `To: ${to}`,
      "Content-Type: text/plain; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${subject}`,
      "",
      body,
    ].join("\n");

    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    res.json({ success: true, message: "Email sent successfully via Gmail API!" });
  } catch (error) {
    console.error("Gmail API Error:", error);
    res.status(500).json({ error: "Failed to send email via API" });
  }
});

// ==========================================
// JOB BOARD & ANALYTICS ROUTES
// ==========================================

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
    } else if (url.includes("linkedin.com")) {
      job = await scrapeLinkedIn(url);
    } else {
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
    const { jobId, resumeText, jobDescription } = req.body;

    if (!jobId || !resumeText || !jobDescription) {
      return res.status(400).json({
        message: "Missing job, resume or job description.",
      });
    }

    const rawResult = await analyzeResume(
      resumeText,
      jobDescription
    );

    const result = JSON.parse(rawResult);

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        matchScore: result.matchScore,
        strengths: result.strengths,
        missingSkills: result.missingSkills,
        suggestions: result.suggestions,
      },
      {
        new: true,
      }
    );

    res.json(updatedJob);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Gemini analysis failed.",
    });
  }
});

app.get("/jobs/stats", async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    
    // Aggregate count by status
    const statusCounts = await Job.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Format status counts into clean object
    const statusMap = {
      Saved: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    statusCounts.forEach((item) => {
      if (item._id in statusMap) {
        statusMap[item._id] = item.count;
      }
    });

    // Calculate Average ATS Match Score
    const avgScoreResult = await Job.aggregate([
      { $match: { matchScore: { $gt: 0 } } },
      { $group: { _id: null, avgScore: { $avg: "$matchScore" } } }
    ]);

    const avgMatchScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    // Response rate (Interview + Offer) / Total Applied
    const totalAppliedOrHigher = statusMap.Applied + statusMap.Interview + statusMap.Offer + statusMap.Rejected;
    const totalPositiveResponses = statusMap.Interview + statusMap.Offer;
    const responseRate = totalAppliedOrHigher > 0 ? Math.round((totalPositiveResponses / totalAppliedOrHigher) * 100) : 0;

    res.json({
      totalJobs,
      statusMap,
      avgMatchScore,
      responseRate,
      chartData: [
        { name: "Saved", value: statusMap.Saved, fill: "#94a3b8" },
        { name: "Applied", value: statusMap.Applied, fill: "#3b82f6" },
        { name: "Interview", value: statusMap.Interview, fill: "#f97316" },
        { name: "Offer", value: statusMap.Offer, fill: "#22c55e" },
        { name: "Rejected", value: statusMap.Rejected, fill: "#ef4444" },
      ]
    });
  } catch (err) {
    console.error("Stats Aggregation Error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

app.post("/generate-email", async (req, res) => {
  try {
    const { company, position, notes } = req.body;

    const prompt = `Write a polite, professional follow-up email to the hiring manager at ${company} regarding my application for the ${position} position.
    Context/Notes: ${notes || "Checking in on application status."}
    
    Return pure JSON with keys: "subject" and "body". No markdown formatting or extra text outside JSON.`;

    const rawResult = await analyzeResume(prompt, "Email Generation Context");
    const result = JSON.parse(rawResult);

    res.json(result);
  } catch (err) {
    console.error("Email Generation Error:", err);
    res.status(500).json({ message: "Failed to generate follow up email draft." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});