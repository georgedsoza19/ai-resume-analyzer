import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId") || undefined;
  const status = searchParams.get("status") || undefined;

  const candidates = await prisma.candidate.findMany({
    where: {
      ...(jobId ? { jobId } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      job: true,
      evaluation: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(candidates);
}
