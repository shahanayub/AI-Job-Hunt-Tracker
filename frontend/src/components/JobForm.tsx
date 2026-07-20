import { useState, useEffect } from 'react'

type JobFormProps = {
  onAddJob: (job: any) => void
  editingJob: any
}

function JobForm({ onAddJob, editingJob }: JobFormProps) {
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [status, setStatus] = useState('Applied')

  useEffect(() => {
    if (editingJob) {
      setCompany(editingJob.job.company)
      setPosition(editingJob.job.position)
      setStatus(editingJob.job.status)
    }
  }, [editingJob])

  function handleSubmit() {
    onAddJob({
      company,
      position,
      status,
    })

    setCompany('')
    setPosition('')
    setStatus('Applied')
  }

  return (
    <div className="job-form">
      <h2>Add New Job</h2>

      <input
        type="text"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        type="text"
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>Applied</option>
        <option>Interview</option>
        <option>Rejected</option>
        <option>Offer</option>
      </select>

      <button onClick={handleSubmit}>
        Save Job
      </button>
    </div>
  )
}

export default JobForm