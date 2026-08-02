import { useState, useEffect } from 'react'

type JobFormProps = {
  onAddJob: (job: any) => void
  editingJob: any
}

function JobForm({ onAddJob, editingJob }: JobFormProps) {
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [status, setStatus] = useState('Applied')
  const [jobUrl, setJobUrl] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
  if (editingJob) {
    setCompany(editingJob.company)
    setPosition(editingJob.position)
    setStatus(editingJob.status)
    setDescription(editingJob.description || '')
    setJobUrl(editingJob.url || '')

  } else {
    setCompany('')
    setPosition('')
    setStatus('Applied')
    setDescription('')
    setJobUrl('')
  }

}, [editingJob])


async function handleScrape() {

  if (!jobUrl) return;

  setLoading(true);
  setError("");

  try {

    const response = await fetch("http://localhost:5000/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: jobUrl,
      }),
    });

    const data = await response.json();

    setCompany(data.company);
    setPosition(data.title);
    setDescription(data.description);

  } catch {

    setError(
    "Scraping failed. If the website blocks automation, please paste the job description below."
);

  }

  setLoading(false);

}


  function handleSubmit() {
    onAddJob({
      company,
      position,
      description,
      url: jobUrl,
      status,
})

    setCompany('')
    setPosition('')
    setStatus('Applied')
    setDescription('')
    setJobUrl('')
  }

  return (
  <div className="job-form">
    <h2>
      {editingJob ? "Edit Job" : "Add New Job"}
    </h2>

    {/* Job URL */}
    <input
      type="text"
      placeholder="Paste Google or LinkedIn Job URL"
      value={jobUrl}
      onChange={(e) => setJobUrl(e.target.value)}
    />

    {/* Scrape Button */}
    <button
      onClick={handleScrape}
      disabled={!jobUrl || loading}
    >
      {loading ? "Scraping..." : "Scrape Job"}
    </button>

    {/* Error */}
    {error && (
      <p style={{ color: "red" }}>
        {error}
      </p>
    )}

    {/* Company */}
    <input
      type="text"
      placeholder="Company Name"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
    />

    {/* Position */}
    <input
      type="text"
      placeholder="Position"
      value={position}
      onChange={(e) => setPosition(e.target.value)}
    />

    <h3>Job Description (Auto-filled or Manual)</h3>
    <p style={{ fontSize: "14px", color: "gray" }}>
    If scraping fails, simply copy the job description from the website and paste it below.
    </p>

    {/* Description */}
    <textarea
      placeholder="Job Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={12}
    />

    {/* Status */}
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    >
      <option>Applied</option>
      <option>Interview</option>
      <option>Rejected</option>
      <option>Offer</option>
    </select>

    {/* Save */}
    <button
      onClick={handleSubmit}
      disabled={!company || !position}
    >
      {editingJob ? "Update Job" : "Save Job"}
    </button>
  </div>
)
}

export default JobForm