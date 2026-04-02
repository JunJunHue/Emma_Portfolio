import type { PortfolioData } from "../types/portfolio";

type Props = {
  data: PortfolioData;
};

export function AboutSection({ data }: Props) {
  const { about } = data;
  return (
    <section className="section" id="about">
      <div className="site-wrap">
        <div className="section-head">
          <span className="section-kicker">About</span>
          <h2>Profile</h2>
        </div>
        <div className="grid-2">
          <div>
            <p className="about-lead">{about.headline}</p>
            {about.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <aside className="contact-card">
            <h3>Contact</h3>
            <div className="contact-row">
              <strong>Email</strong> —{" "}
              <a href={`mailto:${about.contact.email}`}>{about.contact.email}</a>
            </div>
            <div className="contact-row">
              <strong>Phone</strong> — {about.contact.phone}
            </div>
            <div className="contact-row">
              <strong>Location</strong> — {about.contact.location}
            </div>
            {about.links.length > 0 && (
              <div className="link-row">
                {about.links.map((l) => (
                  <a key={l.href + l.label} href={l.href}>
                    {l.label} →
                  </a>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
