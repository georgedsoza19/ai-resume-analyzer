-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "resumeFilename" TEXT NOT NULL,
    "resumeText" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'uploaded',
    "errorMessage" TEXT,
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "jobId" TEXT NOT NULL,
    CONSTRAINT "Candidate_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchScore" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "skillsMatched" TEXT NOT NULL,
    "skillsMissing" TEXT NOT NULL,
    "experienceNotes" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "gaps" TEXT NOT NULL,
    "requirementsChecklist" TEXT NOT NULL,
    "rawJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "candidateId" TEXT NOT NULL,
    CONSTRAINT "Evaluation_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_candidateId_key" ON "Evaluation"("candidateId");
