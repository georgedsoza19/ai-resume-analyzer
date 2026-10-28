import type { SerializedEvaluation } from "./evaluation";

type ExportInput = {
  candidateName: string;
  candidateEmail?: string | null;
  jobTitle: string;
  company: string;
  evaluation: SerializedEvaluation;
};

export function buildMarkdownReport(input: ExportInput) {
  const { candidateName, candidateEmail, jobTitle, company, evaluation } = input;
  const checklist = evaluation.requirementsChecklist
    .map((item) => `- [${item.status}] **${item.requirement}** — ${item.evidence}`)
    .join("\n");

  return `# Candidate evaluation report

> Decision support only — not a final hiring decision. Assessment is based solely on the uploaded resume and job description.

- **Candidate:** ${candidateName}${candidateEmail ? ` (${candidateEmail})` : ""}
- **Role:** ${jobTitle} at ${company}
- **Match score:** ${evaluation.matchScore}/100
- **Generated:** ${new Date(evaluation.createdAt).toUTCString()}

## Summary
${evaluation.summary}

## Experience notes
${evaluation.experienceNotes}

## Requirements checklist
${checklist || "_No checklist items_"}

## Skills matched
${evaluation.skillsMatched.map((s) => `- ${s}`).join("\n") || "- None evidenced"}

## Skills missing
${evaluation.skillsMissing.map((s) => `- ${s}`).join("\n") || "- None noted"}

## Strengths
${evaluation.strengths.map((s) => `- ${s}`).join("\n") || "- None noted"}

## Potential gaps
${evaluation.gaps.map((s) => `- ${s}`).join("\n") || "- None noted"}
`;
}
