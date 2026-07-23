import { Link } from 'react-router-dom'
import JobForm from '../components/JobForm'
import { useState, useEffect } from 'react'

function Dashboard() {
  const [jobs, setJobs] = useState(() => {
  const savedJobs = localStorage.getItem('jobs')
  return savedJobs ? JSON.parse(savedJobs) : []
})
  const [editingJob, setEditingJob] = useState<any>(null)  
  useEffect(() => {
  localStorage.setItem('jobs', JSON.stringify(jobs))
}, [jobs])

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
  <div className="dashboard">
      <h1>Dashboard</h1>
<p className="subtitle">
  Track your applications in one place.
</p>


<JobForm
  onAddJob={addJob}
  editingJob={editingJob}
/>
{jobs.length === 0 && (
  <p>No jobs added yet.</p>
)}

<p>Total Jobs: {jobs.length}</p>

{jobs.map((job: any, index) => (
 <div key={index} className="job-card">
    <h2>{job.company}</h2>
    <p>{job.position}</p>
 <p className={`status ${job.status.toLowerCase()}`}>
  {job.status}
</p>
    <div className="job-actions">
  <button
  className="edit-btn"
  onClick={() =>
    setEditingJob({
      job,
      index,
    })
  }
>
  Edit
</button>

<button
  className="delete-btn"
  onClick={() => deleteJob(index)}
>
  Delete
</button>
</div>

  </div>
))}

      <Link to="/">
        ← Back to Home
      </Link>
    </div>
  )
}

export default Dashboard