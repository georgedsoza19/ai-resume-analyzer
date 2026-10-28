import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jobSchema } from "@/lib/schemas";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      candidates: {
        include: { evaluation: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid job data" },
        { status: 400 }
      );
    }
    const job = await prisma.job.update({ where: { id }, data: parsed.data });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Job not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
}
