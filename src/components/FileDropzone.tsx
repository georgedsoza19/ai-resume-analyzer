"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function FileDropzone({
  file,
  onFile,
  disabled,
}: {
  file: File | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed px-4 py-8 text-center transition",
        dragging ? "border-[var(--accent)] bg-teal-50/60" : "border-[var(--line)] bg-white",
        disabled && "opacity-60"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        const next = e.dataTransfer.files?.[0];
        if (next) onFile(next);
      }}
    >
      <p className="font-medium text-[var(--ink)]">Drop a resume here</p>
      <p className="mt-1 text-sm text-[var(--muted)]">PDF or DOCX, up to 5MB</p>
      <button
        type="button"
        disabled={disabled}
        className="mt-4 text-sm font-medium text-[var(--accent-strong)] underline-offset-2 hover:underline"
        onClick={() => inputRef.current?.click()}
      >
        {file ? "Choose a different file" : "Browse files"}
      </button>
      {file ? (
        <p className="mt-3 text-sm text-[var(--ink)]">
          Selected: <span className="font-medium">{file.name}</span>
        </p>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        disabled={disabled}
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
