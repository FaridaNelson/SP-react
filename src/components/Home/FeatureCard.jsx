export default function FeatureCard({ title, text, Icon }) {
  return (
    <article className="card feature">
      <Icon className="feature__icon" />
      <h3 className="feature__title">{title}</h3>
      <p className="feature__text">{text}</p>
    </article>
  );
}
