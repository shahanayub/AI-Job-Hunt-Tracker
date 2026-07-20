import { Link } from 'react-router-dom'
import JobForm from '../components/JobForm'
import { useState } from 'react'

function Dashboard() {
  const [jobs, setJobs] = useState([])

function addJob(job: any) {
  setJobs([...jobs, job])
} 
  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome to your AI Job Hunt Tracker Dashboard!</p>

<JobForm onAddJob={addJob} />

{jobs.map((job: any, index) => (
  <div key={index}>
    <h3>{job.company}</h3>
    <p>{job.position}</p>
    <p>{job.status}</p>
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