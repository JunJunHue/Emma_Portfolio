type Props = {
  skillsNote: string;
};

export function FooterSkills({ skillsNote }: Props) {
  return (
    <footer className="footer-strip">
      <div className="site-wrap">
        <div className="section-kicker" style={{ marginBottom: "0.5rem" }}>
          Tools & languages
        </div>
        <p style={{ margin: 0 }}>{skillsNote}</p>
      </div>
    </footer>
  );
}
