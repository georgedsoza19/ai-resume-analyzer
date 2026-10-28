"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/jobs", label: "Jobs" },
  { href: "/candidates", label: "Candidates" },
  { href: "/compare", label: "Compare" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(13,148,136,0.12),_transparent_45%),radial-gradient(ellipse_at_bottom_right,_rgba(15,23,42,0.08),_transparent_40%),linear-gradient(180deg,#f4f7f6_0%,#eef3f1_100%)]" />
      <header className="border-b border-[var(--line)] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="group">
            <div className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ink)]">
              Matchline
            </div>
            <div className="text-xs text-[var(--muted)] group-hover:text-[var(--accent-strong)]">
              AI resume analyzer
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-[var(--ink)] text-white"
                      : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-[var(--muted)] sm:px-6">
        Matchline provides evidence-based decision support. Always review the original resume and job description before hiring decisions.
      </footer>
    </div>
  );
}
