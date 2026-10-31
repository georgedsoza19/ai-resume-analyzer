import { GoogleGenerativeAI } from "@google/generative-ai";
import { evaluationSchema, type EvaluationPayload } from "./schemas";

export function hasGeminiKey() {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim());
}

/** Prefer current flash model; fall back if overloaded or unavailable. */
const GEMINI_MODELS = [
  process.env.GEMINI_MODEL?.trim(),
  "gemini-3.8-flash",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
].filter((m, i, arr): m is string => Boolean(m) && arr.indexOf(m) === i);

const MAX_ATTEMPTS_PER_MODEL = 3;
const BASE_DELAY_MS = 800;

const SYSTEM_RULES = `You are a hiring decision-support assistant. Assess the candidate ONLY from the provided resume text and job description.
Never invent employers, titles, dates, skills, education, or achievements that are not explicitly present in the resume.
If evidence is weak or absent, say "insufficient evidence" and lower the match score accordingly.
Return concise, evidence-based insights. This is decision support, not a hiring decision.`;

function buildPrompt(
  jobTitle: string,
  company: string,
  description: string,
  requirements: string,
  resumeText: string
) {
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isTransientGeminiError(message: string) {
  return (
    /\b503\b/.test(message) ||
    /\b429\b/.test(message) ||
    /high demand/i.test(message) ||
    /try again later/i.test(message) ||
    /unavailable/i.test(message) ||
    /resource.?exhausted/i.test(message) ||
    /rate.?limit/i.test(message) ||
    /overloaded/i.test(message)
  );
}

function isModelMissingError(message: string) {
  return (
    /\b404\b/.test(message) ||
    /no longer available/i.test(message) ||
    /not found/i.test(message) ||
    /is not found/i.test(message)
  );
}

function parseEvaluationJson(text: string): EvaluationPayload {
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

async function generateWithModel(
  genAI: GoogleGenerativeAI,
  modelName: string,
  prompt: string
): Promise<EvaluationPayload> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return parseEvaluationJson(result.response.text());
    } catch (error) {
      lastError = error;
      const message = errorMessage(error);
      if (isModelMissingError(message)) throw error;
      if (!isTransientGeminiError(message) || attempt === MAX_ATTEMPTS_PER_MODEL) {
        throw error;
      }
      await sleep(BASE_DELAY_MS * 2 ** (attempt - 1));
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
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
  const prompt = buildPrompt(
    input.jobTitle,
    input.company,
    input.description,
    input.requirements,
    input.resumeText
  );

  const failures: string[] = [];

  for (const modelName of GEMINI_MODELS) {
    try {
      return await generateWithModel(genAI, modelName, prompt);
    } catch (error) {
      const message = errorMessage(error);
      failures.push(`${modelName}: ${message}`);
      // Try next model on overload or missing model; stop on unexpected errors
      if (!isTransientGeminiError(message) && !isModelMissingError(message)) {
        throw new Error(message);
      }
    }
  }

  throw new Error(
    `Gemini is temporarily unavailable (high demand). Please retry in a minute. Details: ${failures[failures.length - 1] ?? "unknown"}`
  );
}
