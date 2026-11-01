const items = ['Hackathon floor', 'Robot race', 'Design duel', 'Quiz arena', 'Cloud workshop', 'Demo day'];
export default function Gallery() {
  return (
    <>
      <h2>Gallery</h2>
      <div className="grid g">
        {items.map((t, i) => (
          <figure key={t}>
            <img src={`/gallery/${i + 1}.svg`} alt={`Illustration of the ${t.toLowerCase()}`} width="400" height="260" loading="lazy" decoding="async" />
            <figcaption>{t}</figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
