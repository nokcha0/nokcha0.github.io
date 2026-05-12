import { thoughtEntries } from "../data/website";

export function ThoughtsSection() {
  return (
    <section id="thoughts" className="section thoughts-section">
      <h2>Random Thoughts and Phrases</h2>
      <p className="summary"></p>
      <div className="thought-list">
        {thoughtEntries.map((thought) => (
          <article className="thought-item" key={thought.title}>
            <div className="thought-copy">
              <div className="thought-heading">
                <h3>{thought.title}</h3>
                <time className="thought-status">{thought.date}</time>
              </div>
              <p className="thought-summary">{thought.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
