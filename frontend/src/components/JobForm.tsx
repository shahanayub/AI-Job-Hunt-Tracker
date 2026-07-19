import { useState } from 'react'
function JobForm() {
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [status, setStatus] = useState('Applied')
function handleSubmit() {
  console.log('Company:', company)
  console.log('Position:', position)
  console.log('Status:', status)
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