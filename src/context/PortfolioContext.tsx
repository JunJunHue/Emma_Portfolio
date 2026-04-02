import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  About,
  EducationItem,
  ExperienceItem,
  LeadershipItem,
  PortfolioData,
  WorkItem,
} from "../types/portfolio";
import { STORAGE_KEY } from "../config/editMode";

function isPortfolioShape(x: unknown): x is PortfolioData {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.meta === "object" &&
    o.meta !== null &&
    typeof (o.meta as { siteTitle?: unknown }).siteTitle === "string" &&
    typeof o.about === "object" &&
    Array.isArray(o.education) &&
    Array.isArray(o.experiences) &&
    Array.isArray(o.leadership) &&
    Array.isArray(o.works) &&
    typeof o.skillsNote === "string"
  );
}

type PortfolioContextValue = {
  data: PortfolioData | null;
  loadError: string | null;
  updateMeta: (patch: Partial<PortfolioData["meta"]>) => void;
  updateAbout: (patch: Partial<About>) => void;
  setEducation: (items: EducationItem[]) => void;
  setExperiences: (items: ExperienceItem[]) => void;
  setLeadership: (items: LeadershipItem[]) => void;
  setWorks: (items: WorkItem[]) => void;
  setSkillsNote: (note: string) => void;
  replaceAll: (data: PortfolioData) => void;
  resetToDefault: () => void;
  persistFromFile: (data: PortfolioData) => void;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [baseline, setBaseline] = useState<PortfolioData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/portfolio.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`Could not load portfolio.json (${res.status})`);
        const base = (await res.json()) as unknown;
        if (!isPortfolioShape(base)) throw new Error("Invalid portfolio.json shape");
        let saved: PortfolioData | null = null;
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed: unknown = JSON.parse(raw);
            if (isPortfolioShape(parsed)) saved = parsed;
          }
        } catch {
          /* ignore */
        }
        if (!cancelled) {
          setBaseline(base);
          setData(saved ?? base);
          setLoadError(null);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load portfolio";
        if (!cancelled) setLoadError(message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* quota or private mode */
    }
  }, [data]);

  const updateMeta = useCallback((patch: Partial<PortfolioData["meta"]>) => {
    setData((d) => (d ? { ...d, meta: { ...d.meta, ...patch } } : d));
  }, []);

  const updateAbout = useCallback((patch: Partial<About>) => {
    setData((d) => (d ? { ...d, about: { ...d.about, ...patch } } : d));
  }, []);

  const setEducation = useCallback((items: EducationItem[]) => {
    setData((d) => (d ? { ...d, education: items } : d));
  }, []);

  const setExperiences = useCallback((items: ExperienceItem[]) => {
    setData((d) => (d ? { ...d, experiences: items } : d));
  }, []);

  const setLeadership = useCallback((items: LeadershipItem[]) => {
    setData((d) => (d ? { ...d, leadership: items } : d));
  }, []);

  const setWorks = useCallback((items: WorkItem[]) => {
    setData((d) => (d ? { ...d, works: items } : d));
  }, []);

  const setSkillsNote = useCallback((note: string) => {
    setData((d) => (d ? { ...d, skillsNote: note } : d));
  }, []);

  const replaceAll = useCallback((next: PortfolioData) => {
    if (!isPortfolioShape(next)) return;
    setData(next);
  }, []);

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    if (baseline) setData(JSON.parse(JSON.stringify(baseline)) as PortfolioData);
  }, [baseline]);

  const persistFromFile = useCallback(
    (fileData: PortfolioData) => {
      replaceAll(fileData);
    },
    [replaceAll],
  );

  const value = useMemo<PortfolioContextValue>(
    () => ({
      data,
      loadError,
      updateMeta,
      updateAbout,
      setEducation,
      setExperiences,
      setLeadership,
      setWorks,
      setSkillsNote,
      replaceAll,
      resetToDefault,
      persistFromFile,
    }),
    [
      data,
      loadError,
      updateMeta,
      updateAbout,
      setEducation,
      setExperiences,
      setLeadership,
      setWorks,
      setSkillsNote,
      replaceAll,
      resetToDefault,
      persistFromFile,
    ],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
