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
- Auto-deploy to Vercel on merge/push to `master` via GitHub Actions

## Stack (free)

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- PostgreSQL via [Neon](https://neon.tech) free tier (required for Vercel)
- Google Gemini (`gemini-2.0-flash`) — free key from [Google AI Studio](https://aistudio.google.com/apikey)
- `pdf-parse` + `mammoth` for resume text extraction
- Vercel hosting + GitHub Actions production deploy

## Local setup

### Requirements

- Node.js 20+
- npm 10+
- A Neon (or other Postgres) database URL

### Install

```bash
npm install
cp .env.example .env
```

### Environment

Edit `.env`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
GOOGLE_GENERATIVE_AI_API_KEY="your-free-key-here"
```

`GOOGLE_GENERATIVE_AI_API_KEY` is optional for browsing seeded demo data. It is required for live resume analysis.

### Database

```bash
npx prisma migrate deploy
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

## Vercel auto-deploy (GitHub Actions)

Repo: [georgedsoza19/ai-resume-analyzer](https://github.com/georgedsoza19/ai-resume-analyzer)  
Vercel project: `ai-resume-analyzer`  
Production: [https://first-project-ten-rho-78.vercel.app](https://first-project-ten-rho-78.vercel.app) (alias may update after Git connect)

Pushes and merges to `master` trigger [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Native Vercel Git deploys also work once the GitHub app is connected.

### 1. Create / link a Vercel project

1. Import this GitHub repo in [Vercel](https://vercel.com) (or run `npx vercel link`).
2. Framework preset: **Next.js** (see `vercel.json`).
3. Build command is already set to run Prisma migrate then `next build`.
4. Connect Git: [Project → Settings → Git](https://vercel.com/geo-projects1/ai-resume-analyzer/settings/git) and install the [Vercel GitHub App](https://github.com/apps/vercel).

### 2. Add Vercel project environment variables

In the Vercel project → **Settings → Environment Variables** (Production):

| Name | Value |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string |
| `DATABASE_URL_UNPOOLED` | Neon **direct** connection string (required for Prisma migrate) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Free Gemini key (optional for demo-only) |
| `NEON_BRANCH` | Optional; set by `neon deploy` (e.g. `production`) |

### 3. Add GitHub Actions secrets

In the GitHub repo → **Settings → Secrets and variables → Actions**:

| Secret | How to get it |
|---|---|
| `VERCEL_TOKEN` | [Vercel → Account Settings → Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | From `.vercel/project.json` after `npx vercel link`, or Vercel team settings |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` after `npx vercel link` |

Quick local link (do not commit `.vercel/`):

```bash
npx vercel link
cat .vercel/project.json
```

### 4. Deploy

Merge a PR into `master` (or push to `master`). The **Deploy to Vercel** workflow builds with `vercel build` and deploys prebuilt production artifacts.

You can also run the workflow manually from the Actions tab (`workflow_dispatch`).

### First production seed

After the first successful deploy, seed demo data once (local CLI against the production `DATABASE_URL`, or temporary one-off):

```bash
DATABASE_URL="your-production-neon-url" npm run db:seed
```

Or use **Load sample data** on the live dashboard (calls `/api/demo/seed`).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start local app |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run db:deploy` | Apply migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Seed sample job + candidates |
| `npx prisma studio` | Browse database data |

## Validation & errors

- Job forms validated with Zod (title, company, description, requirements)
- Uploads limited to PDF/DOCX, max 5MB, with non-empty extracted text
- Compare requires 2–3 analyzed candidates on the same job
- Missing API key, extract failures, and Gemini errors surface clear messages

## Privacy note

Resumes and job text are sent to Google Gemini when you run live analysis. Demo evaluations are local DB records and do not call the API until you re-analyze.
