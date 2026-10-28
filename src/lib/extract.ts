import mammoth from "mammoth";

/**
 * Extract plain text from an uploaded resume.
 * Uses `unpdf` for PDFs (pdf.js without browser DOMMatrix / canvas requirements).
 */
export async function extractResumeText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  const type = file.type;

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    const joined = Array.isArray(text) ? text.join("\n") : String(text || "");
    return joined.replace(/\s+/g, " ").trim();
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
