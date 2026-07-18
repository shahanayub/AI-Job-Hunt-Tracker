import { useState } from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'

type HeroProps = {
  title: string
  subtitle: string
}
function Hero({ title, subtitle }: HeroProps) {
  const [started, setStarted] = useState(false)

  return (
    <main className="hero">
      <h1>{title}</h1>

      <p>
  {started
    ? "🚀 Welcome! Let's start tracking your dream job."
    : subtitle}
</p>

      <Link to="/dashboard">
  <Button
    text="Get Started"
    onClick={() => {}}
  />
</Link>
    </main>
  )
}

export default Hero