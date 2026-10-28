"use client";

import { Button } from "@/components/ui";

export function ExportMenu({ candidateId }: { candidateId: string }) {
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <a href={`/api/candidates/${candidateId}/export?format=md`}>
        <Button variant="secondary" type="button">
          Download Markdown
        </Button>
      </a>
      <Button variant="secondary" type="button" onClick={() => window.print()}>
        Print / Save PDF
      </Button>
    </div>
  );
}
