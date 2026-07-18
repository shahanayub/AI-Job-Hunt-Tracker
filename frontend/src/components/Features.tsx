type Feature = {
  title: string
  description: string
}
type FeaturesProps = {
  features: Feature[]
}
function Features({features} : FeaturesProps) {
  


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