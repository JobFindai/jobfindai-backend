import { PDFParse } from "pdf-parse";

export interface ParsedCV {
  rawText: string;
  sections: {
    summary: string | null;
    experience: string | null;
    education: string | null;
    skills: string | null;
    contact: string | null;
  };
}

const SECTION_PATTERNS: Record<keyof ParsedCV["sections"], RegExp> = {
  summary: /\b(summary|profile|objective|about\s*me|professional\s*summary)\b/i,
  experience: /\b(experience|work\s*history|employment|professional\s*experience|work\s*experience)\b/i,
  education: /\b(education|academic|qualifications|degrees?)\b/i,
  skills: /\b(skills|technical\s*skills|competencies|technologies|expertise)\b/i,
  contact: /\b(contact|address|phone|email|personal\s*info(?:rmation)?)\b/i,
};

export async function parsePDF(buffer: Buffer): Promise<ParsedCV> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  await parser.destroy();

  const rawText = result.text.trim();
  const sections = extractSections(rawText);

  return { rawText, sections };
}

function extractSections(text: string): ParsedCV["sections"] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Find section boundaries
  const sectionIndices: Array<{ key: keyof ParsedCV["sections"]; index: number }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    // Only match lines that look like headings (short lines)
    if (line.length > 80) continue;

    for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(line)) {
        sectionIndices.push({ key: key as keyof ParsedCV["sections"], index: i });
        break;
      }
    }
  }

  // Sort by position in document
  sectionIndices.sort((a, b) => a.index - b.index);

  const sections: ParsedCV["sections"] = {
    summary: null,
    experience: null,
    education: null,
    skills: null,
    contact: null,
  };

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
