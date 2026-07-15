import { useState } from 'react'
import Button from './Button'

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

      <Button
  text={started ? 'Ready!' : 'Get Started'}
  onClick={() => setStarted(true)}
/>
    </main>
  )
}

export default Hero