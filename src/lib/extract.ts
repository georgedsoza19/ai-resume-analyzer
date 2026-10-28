import mammoth from "mammoth";

export async function extractResumeText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  const type = file.type;

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return (result.text || "").replace(/\s+/g, " ").trim();
    } finally {
      await parser.destroy().catch(() => undefined);
    }
  }

  if (
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return (result.value || "").replace(/\s+/g, " ").trim();
  }

  throw new Error("Unsupported file type. Upload a PDF or DOCX resume.");
}
