import { Link } from 'react-router-dom'
import JobForm from '../components/JobForm'
import { useState, useEffect } from 'react'

function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([])
  const [editingJob, setEditingJob] = useState<any>(null)

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
      await fetch(`http://localhost:5000/jobs/${editingJob.id}`, {
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
      const response = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      })

      const data = await response.json()
      console.log(data)

      const jobsResponse = await fetch("http://localhost:5000/jobs")
      const updatedJobs = await jobsResponse.json()

      setJobs(updatedJobs)
    }
  }

  async function deleteJob(jobId: number) {
    await fetch(`http://localhost:5000/jobs/${jobId}`, {
      method: "DELETE",
    })

    const response = await fetch("http://localhost:5000/jobs")
    const updatedJobs = await response.json()

    setJobs(updatedJobs)
  }

  const appliedJobs = jobs.filter((job) => job.status === 'Applied').length
  const interviewJobs = jobs.filter((job) => job.status === 'Interview').length
  const offerJobs = jobs.filter((job) => job.status === 'Offer').length
  const rejectedJobs = jobs.filter((job) => job.status === 'Rejected').length

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <p className="subtitle">
        Track your applications in one place.
      </p>

      <JobForm onAddJob={addJob} editingJob={editingJob} />

      {jobs.length === 0 && (
        <p className="empty-message">No jobs added yet.</p>
      )}

      <p className="total-jobs">Total Jobs: {jobs.length}</p>

      <div className="job-stats">
        <p>🟦 Applied: {appliedJobs}</p>
        <p>🟧 Interview: {interviewJobs}</p>
        <p>🟩 Offers: {offerJobs}</p>
        <p>🟥 Rejected: {rejectedJobs}</p>
      </div>

      {jobs.map((job: any) => (
        <div key={job.id} className="job-card">
          <h2>{job.company}</h2>
          <p>{job.position}</p>

          <p className={`status ${job.status.toLowerCase()}`}>
            {job.status}
          </p>

          <div className="job-actions">
            <button className="edit-btn" onClick={() => setEditingJob(job)}>
              Edit
            </button>

            <button className="delete-btn" onClick={() => deleteJob(job.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
    </div>
  )
}

export default Dashboard