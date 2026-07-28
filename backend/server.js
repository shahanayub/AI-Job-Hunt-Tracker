const cors = require('cors')
const express = require('express')

const app = express()

app.use(cors())
app.use(express.json())

const jobs = []

let nextId = 1

const PORT = 5000

app.get('/', (req, res) => {
  res.send("Backend is running!")
})

app.get('/jobs', (req, res) => {
  res.json(jobs)
})

app.post('/jobs', (req, res) => {

  const newJob = {
    id: nextId,
    ...req.body,
  }

  nextId++

  jobs.push(newJob)

  console.log(jobs)

  res.json({
    message: "Job added successfully!"
  })

})

app.delete('/jobs/:id', (req, res) => {

  const id = Number(req.params.id)

  const updatedJobs = jobs.filter(job => job.id !== id)

  jobs.length = 0
  jobs.push(...updatedJobs)

  console.log(jobs)

  res.json({
    message: "Job deleted successfully!"
  })

})

app.put('/jobs/:id', (req, res) => {

  const id = Number(req.params.id)

  const job = jobs.find(job => job.id === id)

  if (!job) {
    return res.status(404).json({
      message: "Job not found"
    })
  }

  job.company = req.body.company
  job.position = req.body.position
  job.status = req.body.status

  console.log(jobs)

  res.json({
    message: "Job updated successfully!",
    job
  })

})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})