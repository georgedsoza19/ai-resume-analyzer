import type { EvaluationPayload } from "./schemas";

export const SAMPLE_JOB = {
  title: "Frontend Engineer",
  company: "Northline Labs",
  description: `Northline Labs is hiring a Frontend Engineer to build polished product interfaces for our analytics platform.
You will partner with design and backend teams to ship accessible React experiences, improve performance, and maintain a shared component library.
The role emphasizes clear communication, evidence-based UX decisions, and ownership of features from prototype to production.`,
  requirements: `Must-have requirements:
- 3+ years building production web apps with React and TypeScript
- Strong CSS/Tailwind or equivalent design-system experience
- Experience consuming REST or GraphQL APIs
- Familiarity with testing (Jest, React Testing Library, or Playwright)
- Clear written communication and collaborative code review habits
Nice to have: Next.js App Router, accessibility (WCAG), data visualization`,
};

export const SAMPLE_RESUME = `Alex Rivera
alex.rivera@email.com | Portland, OR

Summary
Frontend engineer with 4 years of experience building React and TypeScript applications for B2B SaaS products. Focused on accessible UI, design systems, and measurable performance improvements.

Experience
Senior Frontend Developer — Cascade Metrics (2022–Present)
- Led rebuild of customer dashboard in React 18 and TypeScript, reducing interaction lag by 35%
- Maintained shared component library with Storybook and Tailwind CSS
- Integrated REST APIs for billing and usage analytics; partnered with backend on contract design
- Added React Testing Library coverage for critical flows; introduced Playwright smoke tests

Frontend Developer — Harbor Studio (2020–2022)
- Shipped marketing and product pages in Next.js
- Collaborated with designers on responsive layouts and accessibility fixes (keyboard nav, contrast)

Skills
React, TypeScript, Next.js, Tailwind CSS, CSS Modules, REST APIs, Jest, React Testing Library, Playwright, Git, Agile

Education
B.S. Computer Science — Oregon State University`;

export const SAMPLE_EVALUATION: EvaluationPayload = {
  matchScore: 86,
  summary:
    "Alex’s resume shows strong alignment with a Frontend Engineer role: multi-year React/TypeScript delivery, Tailwind/component-library work, REST API integration, and testing with RTL and Playwright. Next.js experience is evidenced; data visualization is not clearly evidenced.",
  skillsMatched: [
    "React & TypeScript (Cascade Metrics, 2022–Present)",
    "Tailwind CSS and shared component library",
    "REST API integration for billing/analytics",
    "Testing with React Testing Library and Playwright",
    "Next.js delivery at Harbor Studio",
  ],
  skillsMissing: [
    "Data visualization libraries or charting experience (insufficient evidence)",
    "Explicit WCAG audit ownership beyond accessibility fixes",
  ],
  experienceNotes:
    "Four years of frontend work with recent senior-level ownership of a React/TypeScript dashboard and design-system maintenance matches the role’s production focus. Collaborative API work and testing practices support the requirements for quality and partnership with backend/design.",
  strengths: [
    "Direct evidence of React 18 + TypeScript production ownership",
    "Design-system / Tailwind component library experience",
    "Automated testing with RTL and Playwright",
    "Prior Next.js shipping experience",
  ],
  gaps: [
    "No explicit GraphQL experience called out (REST only)",
    "Data visualization called out as nice-to-have but not evidenced on the resume",
  ],
  requirementsChecklist: [
    {
      requirement: "3+ years React and TypeScript in production",
      status: "found",
      evidence: "4 years frontend experience; React 18 and TypeScript dashboard rebuild at Cascade Metrics",
    },
    {
      requirement: "Strong CSS/Tailwind or design-system experience",
      status: "found",
      evidence: "Maintained shared component library with Storybook and Tailwind CSS",
    },
    {
      requirement: "Experience consuming REST or GraphQL APIs",
      status: "partial",
      evidence: "Integrated REST APIs for billing and usage analytics; GraphQL not mentioned",
    },
    {
      requirement: "Familiarity with testing (Jest, RTL, or Playwright)",
      status: "found",
      evidence: "React Testing Library coverage and Playwright smoke tests",
    },
    {
      requirement: "Clear written communication and collaborative code review habits",
      status: "partial",
      evidence: "Collaborated with designers and backend on contracts; code review habits not explicitly stated",
    },
    {
      requirement: "Next.js App Router (nice to have)",
      status: "partial",
      evidence: "Shipped pages in Next.js; App Router not specified",
    },
    {
      requirement: "Accessibility / WCAG (nice to have)",
      status: "partial",
      evidence: "Accessibility fixes including keyboard nav and contrast; WCAG audits not claimed",
    },
    {
      requirement: "Data visualization (nice to have)",
      status: "missing",
      evidence: "insufficient evidence",
    },
  ],
};

export const SAMPLE_RESUME_B = `Jordan Lee
jordan.lee@email.com | Austin, TX

Summary
Full-stack developer with 2 years of experience primarily in Node.js APIs and some React UI work for internal tools.

Experience
Software Engineer — Brightfield Co (2023–Present)
- Built Express REST services for inventory workflows
- Contributed React pages for an internal admin tool using JavaScript (not TypeScript)
- Wrote Jest unit tests for API handlers

Junior Developer — Freelance (2022–2023)
- Created landing pages with HTML/CSS and basic JavaScript

Skills
JavaScript, Node.js, Express, React, HTML, CSS, Jest, SQL, Git

Education
B.A. Information Systems — University of Texas`;

export const SAMPLE_EVALUATION_B: EvaluationPayload = {
  matchScore: 48,
  summary:
    "Jordan shows some React exposure and REST/Jest familiarity, but the resume does not evidence 3+ years of TypeScript frontend ownership, design-system/Tailwind depth, or broader frontend testing tooling required for this role.",
  skillsMatched: [
    "Some React UI contributions on an internal admin tool",
    "REST API experience (Express services)",
    "Jest unit testing for API handlers",
  ],
  skillsMissing: [
    "3+ years React + TypeScript production frontend ownership (insufficient evidence)",
    "Tailwind / design-system experience (insufficient evidence)",
    "Playwright or React Testing Library (insufficient evidence)",
    "Next.js experience (insufficient evidence)",
  ],
  experienceNotes:
    "Two years of software engineering centered on Node/Express with partial React contributions is only partially aligned with a frontend-focused role that asks for multi-year React/TypeScript product work.",
  strengths: [
    "REST API delivery experience",
    "Jest usage and willingness to contribute React UI",
  ],
  gaps: [
    "TypeScript not evidenced",
    "Limited frontend depth relative to role requirements",
    "No evidence of component libraries, accessibility, or Next.js",
  ],
  requirementsChecklist: [
    {
      requirement: "3+ years React and TypeScript in production",
      status: "missing",
      evidence: "2 years total experience; React in JavaScript only; TypeScript not mentioned",
    },
    {
      requirement: "Strong CSS/Tailwind or design-system experience",
      status: "missing",
      evidence: "insufficient evidence",
    },
    {
      requirement: "Experience consuming REST or GraphQL APIs",
      status: "found",
      evidence: "Built Express REST services; contributed React pages consuming internal workflows",
    },
    {
      requirement: "Familiarity with testing (Jest, RTL, or Playwright)",
      status: "partial",
      evidence: "Jest unit tests for API handlers; RTL/Playwright not mentioned",
    },
    {
      requirement: "Clear written communication and collaborative code review habits",
      status: "missing",
      evidence: "insufficient evidence",
    },
    {
      requirement: "Next.js App Router (nice to have)",
      status: "missing",
      evidence: "insufficient evidence",
    },
    {
      requirement: "Accessibility / WCAG (nice to have)",
      status: "missing",
      evidence: "insufficient evidence",
    },
    {
      requirement: "Data visualization (nice to have)",
      status: "missing",
      evidence: "insufficient evidence",
    },
  ],
};
