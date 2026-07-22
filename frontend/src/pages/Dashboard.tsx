import { Link } from 'react-router-dom'
import JobForm from '../components/JobForm'
import { useState } from 'react'

function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [editingJob, setEditingJob] = useState<any>(null)  

function addJob(job: any) {
  if (editingJob) {
    const updatedJobs = [...jobs]
    updatedJobs[editingJob.index] = job
    setJobs(updatedJobs)
    setEditingJob(null)
  } else {
    setJobs([...jobs, job])
  }
}
function deleteJob(indexToDelete: number) {
  setJobs(
    jobs.filter((_, index) => index !== indexToDelete)
  )
}
  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome to your AI Job Hunt Tracker Dashboard!</p>

<JobForm
  onAddJob={addJob}
  editingJob={editingJob}
/>
{jobs.length === 0 && (
  <p>No jobs added yet.</p>
)}

{jobs.map((job: any, index) => (
  <div key={index}>
    <h3>{job.company}</h3>
    <p>{job.position}</p>
    <p>{job.status}</p>
    <button
  onClick={() =>
    setEditingJob({
      job,
      index,
      })
      }
    >
      Edit
    </button>
    <button onClick={() => deleteJob(index)}>
      Delete
    </button>

    <hr />
  </div>
))}

      <Link to="/">
        ← Back to Home
      </Link>
    </div>
  )
}

export default Dashboard