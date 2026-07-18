import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome to your AI Job Hunt Tracker Dashboard!</p>

      <Link to="/">
        ← Back to Home
      </Link>
    </div>
  )
}

export default Dashboard