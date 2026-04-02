import type { PortfolioData } from "../types/portfolio";

type Props = {
  data: PortfolioData;
};

export function Hero({ data }: Props) {
  return (
    <section className="hero" id="top">
      <div className="site-wrap">
        <h1>{data.meta.siteTitle}</h1>
        <p className="hero-tagline">{data.meta.tagline}</p>
        {data.meta.heroTags && data.meta.heroTags.length > 0 ? (
          <div className="hero-chip-row">
            {data.meta.heroTags.map((t, i) => (
              <span key={`${i}-${t}`} className="chip">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
