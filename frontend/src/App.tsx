import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features' 
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

function App() {
  const features = [
  {
    title: '📄 Resume Analysis',
    description: 'Get instant AI feedback to improve your resume.',
  },
  {
    title: '💼 Job Tracking',
    description: 'Keep all your job applications organized in one place.',
  },
  {
    title: '🤖 AI Career Assistant',
    description: 'Discover personalized job opportunities using AI.',
  },
  {
    title: '🎯 Interview Practice',
    description: 'Practice mock interviews with AI and improve your confidence.',
  },
]
  return (
    <Routes>
  <Route
    path="/"
    element={
      <>
        <Navbar />
        <Hero
          title="Land Your Dream Job with AI"
          subtitle="Track applications, analyze resumes, and discover the best opportunities using AI."
        />
        <Features features={features} />
      </>
    }
  />

  <Route path="/dashboard" element={<Dashboard />} />
</Routes>
  )
}

export default App 