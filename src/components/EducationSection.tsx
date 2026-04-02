import type { EducationItem } from "../types/portfolio";

type Props = {
  items: EducationItem[];
};

export function EducationSection({ items }: Props) {
  return (
    <section className="section" id="education">
      <div className="site-wrap">
        <div className="section-head">
          <span className="section-kicker">Academic</span>
          <h2>Education</h2>
        </div>
        <div className="edu-stack">
          {items.map((e) => (
            <article key={e.id} className="edu">
              <h3>{e.school}</h3>
              <div className="meta-line">
                {e.degree} · {e.start} — {e.end} · {e.location}
              </div>
              <ul>
                {e.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
