import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]",
        variant === "secondary" &&
          "border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--surface-2)]",
        variant === "ghost" && "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
        variant === "danger" && "bg-red-700 text-white hover:bg-red-800",
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] focus:ring-2",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
      {children}
    </label>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-[var(--line)] bg-white/90 p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warn" | "danger" | "info";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        tone === "neutral" && "bg-slate-100 text-slate-700",
        tone === "success" && "bg-emerald-50 text-emerald-800",
        tone === "warn" && "bg-amber-50 text-amber-900",
        tone === "danger" && "bg-red-50 text-red-800",
        tone === "info" && "bg-teal-50 text-teal-900"
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--line)] bg-white/60 px-6 py-12 text-center">
      <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white/80 px-4 py-6 text-sm text-[var(--muted)]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent)] border-r-transparent" />
      {label}
    </div>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
      {message}
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      AI evaluations are decision-support tools based only on the uploaded resume and job description.
      They are not final hiring decisions and never invent candidate details.
    </p>
  );
}
