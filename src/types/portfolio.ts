export type ContactInfo = {
  email: string;
  phone: string;
  location: string;
};

export type LinkItem = {
  label: string;
  href: string;
};

export type About = {
  headline: string;
  paragraphs: string[];
  contact: ContactInfo;
  links: LinkItem[];
};

export type EducationItem = {
  id: string;
  school: string;
  degree: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export type ExperienceItem = {
  id: string;
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  highlights: string[];
};

export type LeadershipItem = {
  id: string;
  organization: string;
  title: string;
  location: string;
  start: string;
  end: string;
  highlights: string[];
};

export type WorkItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  year: string;
};

export type PortfolioData = {
  meta: {
    siteTitle: string;
    tagline: string;
    /** Short labels shown under the hero tagline */
    heroTags?: string[];
  };
  about: About;
  education: EducationItem[];
  experiences: ExperienceItem[];
  leadership: LeadershipItem[];
  works: WorkItem[];
  skillsNote: string;
};
