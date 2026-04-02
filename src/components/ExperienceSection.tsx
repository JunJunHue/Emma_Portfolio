import type { ExperienceItem, LeadershipItem } from "../types/portfolio";

type Props = {
  experiences: ExperienceItem[];
  leadership: LeadershipItem[];
};

function ExperienceCard({
  title,
  org,
  location,
  start,
  end,
  highlights,
}: {
  title: string;
  org: string;
  location: string;
  start: string;
  end: string;
  highlights: string[];
}) {
  return (
    <article className="card">
      <div className="card-head">
        <h3>{org}</h3>
        <span className="card-meta">
          {start} — {end}
        </span>
      </div>
      <div className="card-sub">
        {title} · {location}
      </div>
      <ul>
        {highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </article>
  );
}

export function ExperienceSection({ experiences, leadership }: Props) {
  return (
    <section className="section" id="experience">
      <div className="site-wrap">
        <div className="section-head">
          <span className="section-kicker">Track record</span>
          <h2>Experience</h2>
        </div>
        <div className="timeline">
          {experiences.map((e) => (
            <ExperienceCard
              key={e.id}
              org={e.company}
              title={e.title}
              location={e.location}
              start={e.start}
              end={e.end}
              highlights={e.highlights}
            />
          ))}
        </div>

        <div className="section-head" style={{ marginTop: "2.5rem" }}>
          <span className="section-kicker">Leadership</span>
          <h2>Organizations</h2>
        </div>
        <div className="timeline">
          {leadership.map((e) => (
            <ExperienceCard
              key={e.id}
              org={e.organization}
              title={e.title}
              location={e.location}
              start={e.start}
              end={e.end}
              highlights={e.highlights}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
