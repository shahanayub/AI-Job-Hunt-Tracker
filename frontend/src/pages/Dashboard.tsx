import { Link } from 'react-router-dom'
import JobForm from '../components/JobForm'

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome to your AI Job Hunt Tracker Dashboard!</p>

<JobForm />

      <Link to="/">
        ← Back to Home
      </Link>
    </div>
  )
}

export default Dashboard