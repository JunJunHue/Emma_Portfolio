import type { WorkItem } from "../types/portfolio";

type Props = {
  items: WorkItem[];
};

export function WorksSection({ items }: Props) {
  return (
    <section className="section" id="works">
      <div className="site-wrap">
        <div className="section-head">
          <span className="section-kicker">Selected</span>
          <h2>Published work &amp; projects</h2>
        </div>
        <div className="works">
          {items.map((w) => (
            <article key={w.id} className="card work-card">
              <h3>{w.title}</h3>
              <div className="sub">{w.subtitle}</div>
              <p>{w.description}</p>
              <div className="work-foot">
                <span>{w.year}</span>
                {w.url ? (
                  <a href={w.url} target="_blank" rel="noreferrer">
                    View →
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
