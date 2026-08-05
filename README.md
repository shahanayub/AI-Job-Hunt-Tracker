# AI Job Hunt Tracker

An AI-powered full-stack platform designed for automated job scraping, ATS resume analysis, Kanban application tracking, and automated Gmail follow-up email dispatch.

## Live Demo & Services
**Frontend Web App (Vercel):** [https://ai-job-hunt-tracker.vercel.app]
**Backend API Service (Render):** [https://ai-job-hunt-tracker.onrender.com]
**Project Report:** [View Project Report PDF](./Project_Report.pdf?raw=true)

---

## Features
* **Automated & Fallback Scraping:** Parses job details directly from URLs using lightweight scrapers (Axios/Cheerio) with manual text input fallbacks.
* **ATS Resume Matcher:** Utilizes Google Gemini API to compare uploaded PDF resumes against job listings to generate match scores, missing skills, and recommendations.
* **Kanban Application Tracking:** Tracks job status transitions with a complete `statusHistory` timestamp log in MongoDB.
* **Gmail OAuth2 Integration:** Generates tailored follow-up drafts and dispatches emails via Google OAuth 2.0 and the Gmail API using Base64URL payload encoding.

---

## Tech Stack
* **Frontend:** React, CSS Modules 
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **AI & Automation:** Gemini 3.1-flash-lite API, Google Gmail API (OAuth 2.0)
* **Scraping & Data Extraction:** Playwright (Local EDA), Axios, Cheerio, pdf-parse
* **Deployment & CI/CD:** Vercel (Frontend), Render (Backend), GitHub Actions

