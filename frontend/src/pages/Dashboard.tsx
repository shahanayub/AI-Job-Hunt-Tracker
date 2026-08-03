import { Link } from 'react-router-dom'
import JobForm from '../components/JobForm'
import { useState, useEffect } from 'react'
import ResumeUpload from "../components/ResumeUpload";

function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([])
  const [editingJob, setEditingJob] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)

  useEffect(() => {
    async function loadJobs() {
      const response = await fetch("http://localhost:5000/jobs")
      const data = await response.json()
      setJobs(data)
    }

    loadJobs()
  }, [])

  async function addJob(job: any) {
    if (editingJob) {
      await fetch(`http://localhost:5000/jobs/${editingJob._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      })

      const jobsResponse = await fetch("http://localhost:5000/jobs")
      const updatedJobs = await jobsResponse.json()

      setJobs(updatedJobs)
      setEditingJob(null)
    } else {
      await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      })

      const jobsResponse = await fetch("http://localhost:5000/jobs")
      const updatedJobs = await jobsResponse.json()

      setJobs(updatedJobs)
    }
  }

  async function deleteJob(jobId: string) {
    await fetch(`http://localhost:5000/jobs/${jobId}`, {
      method: "DELETE",
    })

    const response = await fetch("http://localhost:5000/jobs")
    const updatedJobs = await response.json()

    setJobs(updatedJobs)
  }

  async function analyzeJob(job: any) {
  setLoadingAnalysis(true)

  try {
    const resumeResponse = await fetch("http://localhost:5000/resume/latest")
    const resume = await resumeResponse.json()

    console.log({
      jobId: job._id,
      resumeText: resume.text,
      jobDescription: job.description,
    })

    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId: job._id,
        resumeText: resume.text,
        jobDescription: job.description,
      }),
    })

    const data = await response.json()

    console.log("Response status:", response.status)
    console.log("Response data:", data)

    if (!response.ok) {
      alert(data.message)
      return
    }

    // Supports BOTH:
    // { result: {...} }
    // and
    // { matchScore:..., strengths:... }
    const result = data.result || data

    setAnalysis({
      jobId: job._id,
      ...result,
    })
  } catch (err) {
    console.log(err)
    alert("Analysis failed.")
  } finally {
    setLoadingAnalysis(false)
  }
}

  const appliedJobs = jobs.filter((job) => job.status === "Applied").length
  const interviewJobs = jobs.filter((job) => job.status === "Interview").length
  const offerJobs = jobs.filter((job) => job.status === "Offer").length
  const rejectedJobs = jobs.filter((job) => job.status === "Rejected").length

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <p className="subtitle">
        Track your applications in one place.
      </p>



      <ResumeUpload />



      <JobForm
        onAddJob={addJob}
        editingJob={editingJob}
      />

      {jobs.length === 0 && (
        <p className="empty-message">
          No jobs added yet.
        </p>
      )}

      <p className="total-jobs">
        Total Jobs: {jobs.length}
      </p>

      <div className="job-stats">
        <p>🟦 Applied: {appliedJobs}</p>
        <p>🟧 Interview: {interviewJobs}</p>
        <p>🟩 Offers: {offerJobs}</p>
        <p>🟥 Rejected: {rejectedJobs}</p>
      </div>

      {jobs.map((job: any) => (
  <div
    key={job._id}
    className="job-card"
  >
    <h2>{job.company}</h2>

    <p>{job.position}</p>

    <p className={`status ${job.status.toLowerCase()}`}>
      {job.status}
    </p>

    <div className="job-actions">
      <button
        className="edit-btn"
        onClick={() => setEditingJob(job)}
      >
        Edit
      </button>

      <button
        className="delete-btn"
        onClick={() => deleteJob(job._id)}
      >
        Delete
      </button>

      <button
        className="analyze-btn"
        onClick={() => analyzeJob(job)}
        disabled={loadingAnalysis}
      >
        {loadingAnalysis ? "Analyzing..." : "Analyze"}
      </button>
    </div>

    {analysis && analysis.jobId === job._id && (
      <div className="analysis-card">
        <h3>🎯 ATS Match: {analysis.matchScore ?? 0}%</h3>

        <p><strong>Strengths</strong></p>
        <ul>
          {(analysis.strengths || []).map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <p><strong>Missing Skills</strong></p>
        <ul>
          {(analysis.missingSkills || []).map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <p><strong>Suggestions</strong></p>
        <ul>
          {(analysis.suggestions || []).map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
))}

<Link
  to="/"
  className="back-link"
>
  ← Back to Home
</Link>

</div>
)
}

export default Dashboard