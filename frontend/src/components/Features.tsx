function Features() {
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
    <section className="features">
      <h2>Why Choose AI Job Hunt Tracker?</h2>

      <div className="feature-cards">
        {features.map((feature) => (
          <div className="card" key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features