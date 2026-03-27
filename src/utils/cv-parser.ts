import { PDFParse } from "pdf-parse";

export interface ExperienceEntry {
  title: string | null;
  company: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface EducationEntry {
  degree: string | null;
  institution: string | null;
  graduationDate: string | null;
  field: string | null;
}

export interface ParsedCV {
  rawText: string;
  parsed: {
    summary: string | null;
    skills: string[];
    experience: ExperienceEntry[];
    education: EducationEntry[];
    certifications: string[];
    languages: string[];
    yearsOfExperience: number | null;
  };
}

const SECTION_PATTERNS = {
  summary: /\b(summary|profile|objective|about\s*me|professional\s*summary)\b/i,
  experience: /\b(experience|work\s*history|employment|professional\s*experience|work\s*experience)\b/i,
  education: /\b(education|academic|qualifications|degrees?)\b/i,
  skills: /\b(skills|technical\s*skills|competencies|technologies|expertise)\b/i,
  certifications: /\b(certifications?|licenses?|accreditations?)\b/i,
  languages: /\b(languages?)\b/i,
} as const;

type SectionKey = keyof typeof SECTION_PATTERNS;

export async function parsePDF(buffer: Buffer): Promise<ParsedCV> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  await parser.destroy();

  const rawText = result.text.trim();
  const rawSections = extractRawSections(rawText);

  return {
    rawText,
    parsed: {
      summary: rawSections.summary ?? null,
      skills: parseSkills(rawSections.skills),
      experience: parseExperience(rawSections.experience),
      education: parseEducation(rawSections.education),
      certifications: parseList(rawSections.certifications),
      languages: parseList(rawSections.languages),
      yearsOfExperience: null, // requires AI to estimate
    },
  };
}

function extractRawSections(text: string): Partial<Record<SectionKey, string>> {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const sectionIndices: Array<{ key: SectionKey; index: number }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (line.length > 80) continue;

    for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(line)) {
        sectionIndices.push({ key: key as SectionKey, index: i });
        break;
      }
    }
  }

  sectionIndices.sort((a, b) => a.index - b.index);

  const sections: Partial<Record<SectionKey, string>> = {};

  for (let i = 0; i < sectionIndices.length; i++) {
    const current = sectionIndices[i]!;
    const next = sectionIndices[i + 1];
    const startLine = current.index + 1;
    const endLine = next ? next.index : lines.length;
    const content = lines.slice(startLine, endLine).join("\n").trim();

    if (content) {
      sections[current.key] = content;
    }
  }

  // If no sections detected, put everything in summary
  if (sectionIndices.length === 0 && text.replace(/\s/g, "").length > 10) {
    sections.summary = text;
  }

  return sections;
}

function parseSkills(raw: string | undefined): string[] {
  if (!raw) return [];
  // Split on commas, bullets, pipes, newlines
  return raw
    .split(/[,|•·\n]/)
    .map((s) => s.replace(/^[-–—*]\s*/, "").trim())
    .filter((s) => s.length > 0 && s.length < 60);
}

function parseExperience(raw: string | undefined): ExperienceEntry[] {
  if (!raw) return [];
  // Basic: split by double newline or lines that look like job titles
  // Without AI, return the whole block as one entry
  return [
    {
      title: null,
      company: null,
      startDate: null,
      endDate: null,
      description: raw,
    },
  ];
}

function parseEducation(raw: string | undefined): EducationEntry[] {
  if (!raw) return [];
  return [
    {
      degree: null,
      institution: null,
      graduationDate: null,
      field: null,
    },
  ];
}

function parseList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,|•·\n]/)
    .map((s) => s.replace(/^[-–—*]\s*/, "").trim())
    .filter((s) => s.length > 0 && s.length < 100);
}
