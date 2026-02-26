export default function FeatureCard({ title, text }) {
  return (
    <article className="card feature">
      <h3 className="feature__title">{title}</h3>
      <p className="feature__text">{text}</p>
    </article>
  );
}
