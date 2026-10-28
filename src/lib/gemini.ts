import { GoogleGenerativeAI } from "@google/generative-ai";
import { evaluationSchema, type EvaluationPayload } from "./schemas";

export function hasGeminiKey() {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim());
}

const SYSTEM_RULES = `You are a hiring decision-support assistant. Assess the candidate ONLY from the provided resume text and job description.
Never invent employers, titles, dates, skills, education, or achievements that are not explicitly present in the resume.
If evidence is weak or absent, say "insufficient evidence" and lower the match score accordingly.
Return concise, evidence-based insights. This is decision support, not a hiring decision.`;

function buildPrompt(jobTitle: string, company: string, description: string, requirements: string, resumeText: string) {
  return `${SYSTEM_RULES}

Return ONLY valid JSON matching this shape:
{
  "matchScore": number 0-100,
  "summary": "2-4 sentences",
  "skillsMatched": ["skill with brief evidence"],
  "skillsMissing": ["skill or requirement not evidenced"],
  "experienceNotes": "paragraph grounded in resume + role",
  "strengths": ["strength grounded in resume"],
  "gaps": ["gap or risk grounded in missing evidence"],
  "requirementsChecklist": [
    { "requirement": "discrete must-have from JD", "status": "found|partial|missing", "evidence": "short resume quote or insufficient evidence" }
  ]
}

Extract 5-10 discrete must-have requirements from the job description/requirements for requirementsChecklist.

JOB TITLE: ${jobTitle}
COMPANY: ${company}

JOB DESCRIPTION:
${description}

REQUIREMENTS:
${requirements}

RESUME TEXT:
${resumeText}`;
}

export async function analyzeResumeAgainstJob(input: {
  jobTitle: string;
  company: string;
  description: string;
  requirements: string;
  resumeText: string;
}): Promise<EvaluationPayload> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "Missing GOOGLE_GENERATIVE_AI_API_KEY. Add a free key from Google AI Studio to analyze resumes."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.8-flash",
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(
    buildPrompt(
      input.jobTitle,
      input.company,
      input.description,
      input.requirements,
      input.resumeText
    )
  );

  const text = result.response.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI returned an unreadable response. Please retry.");
    parsed = JSON.parse(match[0]);
  }

  return evaluationSchema.parse(parsed);
}
