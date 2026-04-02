import { useId, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import type {
  EducationItem,
  ExperienceItem,
  LeadershipItem,
  LinkItem,
  PortfolioData,
  WorkItem,
} from "../types/portfolio";
import { newId } from "../lib/id";

type Tab = "meta" | "about" | "experience" | "leadership" | "education" | "works" | "skills";

const tabs: { id: Tab; label: string }[] = [
  { id: "meta", label: "Site" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "leadership", label: "Leadership" },
  { id: "education", label: "Education" },
  { id: "works", label: "Works" },
  { id: "skills", label: "Skills" },
];

function highlightsToText(h: string[]): string {
  return h.join("\n");
}

function textToHighlights(t: string): string[] {
  return t
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export function EditDrawer({ open, onClose }: Props) {
  const {
    data,
    updateMeta,
    updateAbout,
    setEducation,
    setExperiences,
    setLeadership,
    setWorks,
    setSkillsNote,
    resetToDefault,
    persistFromFile,
  } = usePortfolio();
  const [tab, setTab] = useState<Tab>("about");

  const importInputId = useId();

  if (!open || !data) return null;

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as PortfolioData;
      persistFromFile(parsed);
    } catch {
      window.alert("Could not read that file. Use a portfolio JSON export.");
    }
  };

  const confirmReset = () => {
    if (
      window.confirm(
        "Reset all content to the default site file? This clears saved edits in this browser.",
      )
    ) {
      resetToDefault();
    }
  };

  const paragraphsText = data.about.paragraphs.join("\n\n");

  const patchParagraphs = (raw: string) => {
    const paragraphs = raw
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    updateAbout({ paragraphs });
  };

  const setLink = (index: number, patch: Partial<LinkItem>) => {
    const links = data.about.links.map((l, i) => (i === index ? { ...l, ...patch } : l));
    updateAbout({ links });
  };

  const addLink = () => {
    updateAbout({ links: [...data.about.links, { label: "New link", href: "https://" }] });
  };

  const removeLink = (index: number) => {
    updateAbout({ links: data.about.links.filter((_, i) => i !== index) });
  };

  const patchExperience = (index: number, patch: Partial<ExperienceItem>) => {
    const experiences = data.experiences.map((x, i) => (i === index ? { ...x, ...patch } : x));
    setExperiences(experiences);
  };

  const addExperience = () => {
    const item: ExperienceItem = {
      id: newId("exp"),
      company: "Organization",
      title: "Role",
      location: "City",
      start: "",
      end: "",
      highlights: ["Highlight one"],
    };
    setExperiences([...data.experiences, item]);
  };

  const removeExperience = (index: number) => {
    setExperiences(data.experiences.filter((_, i) => i !== index));
  };

  const patchLeadership = (index: number, patch: Partial<LeadershipItem>) => {
    const leadership = data.leadership.map((x, i) => (i === index ? { ...x, ...patch } : x));
    setLeadership(leadership);
  };

  const addLeadership = () => {
    const item: LeadershipItem = {
      id: newId("lead"),
      organization: "Organization",
      title: "Role",
      location: "City",
      start: "",
      end: "",
      highlights: [],
    };
    setLeadership([...data.leadership, item]);
  };

  const removeLeadership = (index: number) => {
    setLeadership(data.leadership.filter((_, i) => i !== index));
  };

  const patchEducation = (index: number, patch: Partial<EducationItem>) => {
    const education = data.education.map((x, i) => (i === index ? { ...x, ...patch } : x));
    setEducation(education);
  };

  const addEducation = () => {
    const item: EducationItem = {
      id: newId("edu"),
      school: "School",
      degree: "Degree",
      location: "City",
      start: "",
      end: "",
      bullets: [],
    };
    setEducation([...data.education, item]);
  };

  const removeEducation = (index: number) => {
    setEducation(data.education.filter((_, i) => i !== index));
  };

  const patchWork = (index: number, patch: Partial<WorkItem>) => {
    const works = data.works.map((x, i) => (i === index ? { ...x, ...patch } : x));
    setWorks(works);
  };

  const addWork = () => {
    const item: WorkItem = {
      id: newId("work"),
      title: "Title",
      subtitle: "Context",
      description: "Short description",
      url: "",
      year: new Date().getFullYear().toString(),
    };
    setWorks([...data.works, item]);
  };

  const removeWork = (index: number) => {
    setWorks(data.works.filter((_, i) => i !== index));
  };

  return (
    <>
      <div
        className="drawer-backdrop"
        role="presentation"
        aria-hidden
        onClick={onClose}
      />
      <aside className="drawer" aria-label="Edit portfolio content">
        <div className="drawer-header">
          <h2>Edit content</h2>
          <button type="button" className="btn ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="drawer-body">
          <p className="edit-hint">
            Changes save automatically in this browser. Export a JSON file for backups or to share
            with whoever deploys the site.
          </p>
          <div className="tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className="tab"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "meta" && (
            <div role="tabpanel">
              <div className="form-group">
                <label>Site title</label>
                <input
                  value={data.meta.siteTitle}
                  onChange={(e) => updateMeta({ siteTitle: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Tagline</label>
                <input
                  value={data.meta.tagline}
                  onChange={(e) => updateMeta({ tagline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Hero tags (one per line, optional)</label>
                <textarea
                  value={(data.meta.heroTags ?? []).join("\n")}
                  onChange={(e) =>
                    updateMeta({
                      heroTags: textToHighlights(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}

          {tab === "about" && (
            <div role="tabpanel">
              <div className="form-group">
                <label>Headline</label>
                <textarea
                  value={data.about.headline}
                  onChange={(e) => updateAbout({ headline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Paragraphs (blank line between paragraphs)</label>
                <textarea value={paragraphsText} onChange={(e) => patchParagraphs(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  value={data.about.contact.email}
                  onChange={(e) =>
                    updateAbout({ contact: { ...data.about.contact, email: e.target.value } })
                  }
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  value={data.about.contact.phone}
                  onChange={(e) =>
                    updateAbout({ contact: { ...data.about.contact, phone: e.target.value } })
                  }
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  value={data.about.contact.location}
                  onChange={(e) =>
                    updateAbout({ contact: { ...data.about.contact, location: e.target.value } })
                  }
                />
              </div>
              <div className="form-group">
                <label>Links</label>
                {data.about.links.map((l, i) => (
                  <div key={i} className="item-editor">
                    <div className="form-group">
                      <label>Label</label>
                      <input value={l.label} onChange={(e) => setLink(i, { label: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>URL</label>
                      <input value={l.href} onChange={(e) => setLink(i, { href: e.target.value })} />
                    </div>
                    <button type="button" className="btn danger" onClick={() => removeLink(i)}>
                      Remove link
                    </button>
                  </div>
                ))}
                <button type="button" className="btn" onClick={addLink}>
                  Add link
                </button>
              </div>
            </div>
          )}

          {tab === "experience" && (
            <div role="tabpanel">
              {data.experiences.map((ex, i) => (
                <div key={ex.id} className="item-editor">
                  <h4>Role {i + 1}</h4>
                  <div className="form-group">
                    <label>Company</label>
                    <input value={ex.company} onChange={(e) => patchExperience(i, { company: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input value={ex.title} onChange={(e) => patchExperience(i, { title: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input value={ex.location} onChange={(e) => patchExperience(i, { location: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Start</label>
                    <input value={ex.start} onChange={(e) => patchExperience(i, { start: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>End</label>
                    <input value={ex.end} onChange={(e) => patchExperience(i, { end: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Bullets (one per line)</label>
                    <textarea
                      value={highlightsToText(ex.highlights)}
                      onChange={(e) =>
                        patchExperience(i, { highlights: textToHighlights(e.target.value) })
                      }
                    />
                  </div>
                  <button type="button" className="btn danger" onClick={() => removeExperience(i)}>
                    Remove role
                  </button>
                </div>
              ))}
              <button type="button" className="btn primary" onClick={addExperience}>
                Add experience
              </button>
            </div>
          )}

          {tab === "leadership" && (
            <div role="tabpanel">
              {data.leadership.map((ex, i) => (
                <div key={ex.id} className="item-editor">
                  <h4>Entry {i + 1}</h4>
                  <div className="form-group">
                    <label>Organization</label>
                    <input
                      value={ex.organization}
                      onChange={(e) => patchLeadership(i, { organization: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input value={ex.title} onChange={(e) => patchLeadership(i, { title: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      value={ex.location}
                      onChange={(e) => patchLeadership(i, { location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Start</label>
                    <input value={ex.start} onChange={(e) => patchLeadership(i, { start: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>End</label>
                    <input value={ex.end} onChange={(e) => patchLeadership(i, { end: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Bullets (one per line)</label>
                    <textarea
                      value={highlightsToText(ex.highlights)}
                      onChange={(e) =>
                        patchLeadership(i, { highlights: textToHighlights(e.target.value) })
                      }
                    />
                  </div>
                  <button type="button" className="btn danger" onClick={() => removeLeadership(i)}>
                    Remove entry
                  </button>
                </div>
              ))}
              <button type="button" className="btn primary" onClick={addLeadership}>
                Add leadership entry
              </button>
            </div>
          )}

          {tab === "education" && (
            <div role="tabpanel">
              {data.education.map((ed, i) => (
                <div key={ed.id} className="item-editor">
                  <h4>School {i + 1}</h4>
                  <div className="form-group">
                    <label>School</label>
                    <input value={ed.school} onChange={(e) => patchEducation(i, { school: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Degree</label>
                    <input value={ed.degree} onChange={(e) => patchEducation(i, { degree: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      value={ed.location}
                      onChange={(e) => patchEducation(i, { location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Start</label>
                    <input value={ed.start} onChange={(e) => patchEducation(i, { start: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>End</label>
                    <input value={ed.end} onChange={(e) => patchEducation(i, { end: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Bullets (one per line)</label>
                    <textarea
                      value={highlightsToText(ed.bullets)}
                      onChange={(e) =>
                        patchEducation(i, { bullets: textToHighlights(e.target.value) })
                      }
                    />
                  </div>
                  <button type="button" className="btn danger" onClick={() => removeEducation(i)}>
                    Remove school
                  </button>
                </div>
              ))}
              <button type="button" className="btn primary" onClick={addEducation}>
                Add education
              </button>
            </div>
          )}

          {tab === "works" && (
            <div role="tabpanel">
              {data.works.map((w, i) => (
                <div key={w.id} className="item-editor">
                  <h4>Work {i + 1}</h4>
                  <div className="form-group">
                    <label>Title</label>
                    <input value={w.title} onChange={(e) => patchWork(i, { title: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Subtitle / context</label>
                    <input value={w.subtitle} onChange={(e) => patchWork(i, { subtitle: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={w.description}
                      onChange={(e) => patchWork(i, { description: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Link (optional)</label>
                    <input value={w.url} onChange={(e) => patchWork(i, { url: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input value={w.year} onChange={(e) => patchWork(i, { year: e.target.value })} />
                  </div>
                  <button type="button" className="btn danger" onClick={() => removeWork(i)}>
                    Remove work
                  </button>
                </div>
              ))}
              <button type="button" className="btn primary" onClick={addWork}>
                Add work
              </button>
            </div>
          )}

          {tab === "skills" && (
            <div role="tabpanel">
              <div className="form-group">
                <label>Skills & languages line</label>
                <textarea value={data.skillsNote} onChange={(e) => setSkillsNote(e.target.value)} />
              </div>
            </div>
          )}

          <div className="form-actions" style={{ marginTop: "1.5rem" }}>
            <button type="button" className="btn primary" onClick={exportJson}>
              Export JSON
            </button>
            <label className="btn" htmlFor={importInputId} style={{ cursor: "pointer" }}>
              Import JSON
            </label>
            <input id={importInputId} type="file" accept="application/json" hidden onChange={onImportFile} />
            <button type="button" className="btn danger" onClick={confirmReset}>
              Reset to default
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
