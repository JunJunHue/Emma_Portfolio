import { useState } from "react";
import { usePortfolio } from "./context/PortfolioContext";
import { useSessionEditGate } from "./hooks/useSessionEditGate";
import { AboutSection } from "./components/AboutSection";
import { EditDrawer } from "./components/EditDrawer";
import { EditPasswordModal } from "./components/EditPasswordModal";
import { EducationSection } from "./components/EducationSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { FooterSkills } from "./components/FooterSkills";
import { Hero } from "./components/Hero";
import { Navigation } from "./components/Navigation";
import { WorksSection } from "./components/WorksSection";

export default function App() {
  const { data, loadError } = usePortfolio();
  const { unlocked, unlock, lock } = useSessionEditGate();
  const [showPw, setShowPw] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (loadError) {
    return (
      <div className="site-wrap" style={{ padding: "4rem 0" }}>
        <h1>Could not load portfolio</h1>
        <p>{loadError}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="site-wrap" style={{ padding: "4rem 0" }}>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <>
      <Navigation data={data} />
      <main>
        <Hero data={data} />
        <AboutSection data={data} />
        <ExperienceSection experiences={data.experiences} leadership={data.leadership} />
        <EducationSection items={data.education} />
        <WorksSection items={data.works} />
        <FooterSkills skillsNote={data.skillsNote} />
      </main>

      <EditPasswordModal
        open={showPw}
        onClose={() => setShowPw(false)}
        onSuccess={() => setDrawerOpen(true)}
        verify={unlock}
      />

      <EditDrawer open={unlocked && drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="edit-fab-row">
        {unlocked ? (
          <>
            <button type="button" className="edit-fab" onClick={() => setDrawerOpen((v) => !v)}>
              {drawerOpen ? "Hide editor" : "Edit content"}
            </button>
            <button type="button" className="edit-fab secondary" onClick={lock}>
              Lock edit mode
            </button>
          </>
        ) : (
          <button type="button" className="edit-fab" onClick={() => setShowPw(true)}>
            Edit
          </button>
        )}
      </div>
    </>
  );
}
