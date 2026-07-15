import { useState } from 'react'

function Hero() {
  const [started, setStarted] = useState(false)

  return (
    <main className="hero">
      <h1>Land Your Dream Job with AI</h1>

      <p>
        {started
          ? '🚀 Welcome! Let’s start tracking your dream job.'
          : 'Track applications, analyze resumes, and discover the best opportunities using AI.'}
      </p>

      <button onClick={() => setStarted(true)}>
        {started ? 'Ready!' : 'Get Started'}
      </button>
    </main>
  )
}

export default Hero