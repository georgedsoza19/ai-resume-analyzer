import { NextResponse } from "next/server";
import { resetSampleData } from "@/lib/demo";

export async function POST() {
  try {
    const result = await resetSampleData();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reset demo data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
