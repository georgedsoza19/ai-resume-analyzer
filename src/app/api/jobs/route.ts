import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jobSchema } from "@/lib/schemas";

export async function GET() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { candidates: true } },
      candidates: {
        include: { evaluation: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid job data" },
        { status: 400 }
      );
    }
    const job = await prisma.job.create({ data: parsed.data });
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
