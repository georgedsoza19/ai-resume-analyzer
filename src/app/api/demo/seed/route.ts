import { NextResponse } from "next/server";
import { seedSampleData } from "@/lib/demo";

export async function POST() {
  try {
    const result = await seedSampleData();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to seed demo data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
