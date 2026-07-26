const express = require('express')

const app = express()

app.use(express.json())

const jobs = []

const PORT = 5000

app.get('/', (req, res) => {
  res.send("Backend is running!")
})

app.get('/jobs', (req, res) => {
  res.json(jobs)
})

app.post('/jobs', (req, res) => {

  jobs.push(req.body)

  console.log("POST route hit!")
  console.log(jobs)

  res.json({
    message: "Job added successfully!"
  })

})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})