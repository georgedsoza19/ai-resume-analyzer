# Matchline — AI Resume Analyzer

Polished Next.js app for creating job listings, uploading candidate resumes, and generating **evidence-based** match evaluations with Google Gemini’s free API.

Assessments use **only** the uploaded resume text and job description. Insights are **decision support**, not hiring decisions.

## Features

- Dashboard for jobs and candidates
- Job create / edit / delete
- Resume upload (PDF / DOCX) with processing states
- AI match score, skills, strengths, gaps, and requirements checklist
- Side-by-side compare (2–3 analyzed candidates on the same job)
- Markdown export + print-to-PDF
- Sample demo mode (works without an API key)

## Stack (free)

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- SQLite via Prisma
- Google Gemini (`gemini-2.0-flash`) — free key from [Google AI Studio](https://aistudio.google.com/apikey)
- `pdf-parse` + `mammoth` for resume text extraction

## Setup

### Requirements

- Node.js 20+
- npm 10+

### Install

```bash
npm install
cp .env.example .env
```

### Environment

Edit `.env`:

```bash
DATABASE_URL="file:./dev.db"
GOOGLE_GENERATIVE_AI_API_KEY="your-free-key-here"
```

`GOOGLE_GENERATIVE_AI_API_KEY` is optional for browsing seeded demo data. It is required for live resume analysis.

### Database

```bash
npx prisma migrate dev
npm run db:seed
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo without an API key

1. Run migrate + seed (or use **Load sample data** on the dashboard).
2. Open the sample **Frontend Engineer** job and candidates **Alex Rivera** / **Jordan Lee**.
3. Compare them from the candidates list.
4. Export Markdown or use Print / Save PDF on an evaluation page.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start local app |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run db:seed` | Seed sample job + candidates |
| `npx prisma studio` | Browse SQLite data |

## Validation & errors

- Job forms validated with Zod (title, company, description, requirements)
- Uploads limited to PDF/DOCX, max 5MB, with non-empty extracted text
- Compare requires 2–3 analyzed candidates on the same job
- Missing API key, extract failures, and Gemini errors surface clear messages

## Privacy note

Resumes and job text are sent to Google Gemini when you run live analysis. Demo evaluations are local and do not call the API.
