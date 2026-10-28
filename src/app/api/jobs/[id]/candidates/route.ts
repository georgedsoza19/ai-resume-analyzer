import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractResumeText } from "@/lib/extract";
import { runAnalysisForCandidate } from "@/lib/evaluation";
import { hasGeminiKey } from "@/lib/gemini";
import { ALLOWED_RESUME_TYPES, MAX_RESUME_BYTES } from "@/lib/schemas";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id: jobId } = await params;

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    const name = String(form.get("name") || "").trim();
    const emailRaw = String(form.get("email") || "").trim();
    const email = emailRaw || null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Candidate name is required" }, { status: 400 });
    }
    if (file.size > MAX_RESUME_BYTES) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const allowedExt =
      file.name.toLowerCase().endsWith(".pdf") || file.name.toLowerCase().endsWith(".docx");
    const allowedType =
      ALLOWED_RESUME_TYPES.includes(file.type as (typeof ALLOWED_RESUME_TYPES)[number]) ||
      file.type === "" ||
      file.type === "application/octet-stream";

    if (!allowedExt && !allowedType) {
      return NextResponse.json({ error: "Upload a PDF or DOCX resume" }, { status: 400 });
    }

    let resumeText = "";
    try {
      resumeText = await extractResumeText(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not read resume";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!resumeText || resumeText.length < 40) {
      return NextResponse.json(
        { error: "Could not extract enough text from the resume. Try another file." },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        resumeFilename: file.name,
        resumeText,
        status: "uploaded",
        jobId,
      },
    });

    if (!hasGeminiKey()) {
      await prisma.candidate.update({
        where: { id: candidate.id },
        data: {
          status: "failed",
          errorMessage:
            "Missing GOOGLE_GENERATIVE_AI_API_KEY. Add a free Gemini key to analyze uploads, or explore the seeded demo candidate.",
        },
      });
      return NextResponse.json(
        {
          candidate,
          warning:
            "Resume saved but not analyzed — add GOOGLE_GENERATIVE_AI_API_KEY to enable AI evaluation.",
        },
        { status: 201 }
      );
    }

    try {
      const evaluation = await runAnalysisForCandidate(candidate, job);
      const refreshed = await prisma.candidate.findUnique({
        where: { id: candidate.id },
        include: { evaluation: true },
      });
      return NextResponse.json({ candidate: refreshed, evaluation }, { status: 201 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Analysis failed";
      const failed = await prisma.candidate.findUnique({ where: { id: candidate.id } });
      return NextResponse.json({ candidate: failed, error: message }, { status: 201 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
