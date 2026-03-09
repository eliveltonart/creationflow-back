-- CreateEnum
CREATE TYPE "PlanningStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RefinementStatus" AS ENUM ('PENDING', 'IN_DISCUSSION', 'REFINED', 'ACCEPTED_WITHOUT_REFINEMENT');

-- CreateEnum
CREATE TYPE "IntruderType" AS ENUM ('PRODUCTION_BUG', 'CLIENT_SUPPORT', 'TECH_DEBT', 'TRAINING', 'EXTRA_MEETING', 'INFRASTRUCTURE', 'OTHER');

-- CreateTable: plannings
CREATE TABLE "plannings" (
    "id"              TEXT NOT NULL,
    "name"            TEXT NOT NULL,
    "status"          "PlanningStatus" NOT NULL DEFAULT 'DRAFT',
    "sprintGoal"      TEXT,
    "currentStep"     INTEGER NOT NULL DEFAULT 1,
    "durationMinutes" INTEGER,
    "scheduledAt"     TIMESTAMP(3),
    "startedAt"       TIMESTAMP(3),
    "completedAt"     TIMESTAMP(3),
    "notes"           TEXT,
    "closingNotes"    TEXT,
    "velocityAverage" DOUBLE PRECISION,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    "projectId"       TEXT NOT NULL,
    "sprintId"        TEXT NOT NULL,
    "facilitatorId"   TEXT NOT NULL,
    "createdById"     TEXT NOT NULL,
    CONSTRAINT "plannings_pkey" PRIMARY KEY ("id")
);

-- CreateTable: planning_participants
CREATE TABLE "planning_participants" (
    "id"          TEXT NOT NULL,
    "committed"   BOOLEAN NOT NULL DEFAULT false,
    "committedAt" TIMESTAMP(3),
    "joinedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planningId"  TEXT NOT NULL,
    "employerId"  TEXT NOT NULL,
    CONSTRAINT "planning_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable: planning_tasks
CREATE TABLE "planning_tasks" (
    "id"               TEXT NOT NULL,
    "storyPointsFinal" INTEGER,
    "hoursEstimated"   DOUBLE PRECISION,
    "refinementStatus" "RefinementStatus" NOT NULL DEFAULT 'PENDING',
    "refinementNotes"  TEXT,
    "isDesignTask"     BOOLEAN NOT NULL DEFAULT false,
    "addedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planningId"       TEXT NOT NULL,
    "taskId"           TEXT NOT NULL,
    "assigneeId"       TEXT,
    "handoffId"        TEXT,
    CONSTRAINT "planning_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable: planning_votes
CREATE TABLE "planning_votes" (
    "id"         TEXT NOT NULL,
    "voteValue"  TEXT NOT NULL,
    "round"      INTEGER NOT NULL DEFAULT 1,
    "votedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planningId" TEXT NOT NULL,
    "taskId"     TEXT NOT NULL,
    "voterId"    TEXT NOT NULL,
    CONSTRAINT "planning_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable: planning_capacity
CREATE TABLE "planning_capacity" (
    "id"             TEXT NOT NULL,
    "totalHours"     DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ritesHours"     DOUBLE PRECISION NOT NULL DEFAULT 0,
    "intrudersHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "absencesHours"  DOUBLE PRECISION NOT NULL DEFAULT 0,
    "effectiveHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "committedSp"    INTEGER NOT NULL DEFAULT 0,
    "committedHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    "planningId"     TEXT NOT NULL,
    CONSTRAINT "planning_capacity_pkey" PRIMARY KEY ("id")
);

-- CreateTable: planning_rites
CREATE TABLE "planning_rites" (
    "id"                 TEXT NOT NULL,
    "name"               TEXT NOT NULL,
    "frequencyPerSprint" INTEGER NOT NULL DEFAULT 1,
    "durationMinutes"    INTEGER NOT NULL,
    "participantsCount"  INTEGER NOT NULL DEFAULT 1,
    "totalHours"         DOUBLE PRECISION NOT NULL,
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planningId"         TEXT NOT NULL,
    CONSTRAINT "planning_rites_pkey" PRIMARY KEY ("id")
);

-- CreateTable: planning_intruders
CREATE TABLE "planning_intruders" (
    "id"             TEXT NOT NULL,
    "type"           "IntruderType" NOT NULL,
    "description"    TEXT,
    "estimatedHours" DOUBLE PRECISION NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planningId"     TEXT NOT NULL,
    CONSTRAINT "planning_intruders_pkey" PRIMARY KEY ("id")
);

-- CreateTable: planning_absences
CREATE TABLE "planning_absences" (
    "id"         TEXT NOT NULL,
    "startDate"  TIMESTAMP(3) NOT NULL,
    "endDate"    TIMESTAMP(3) NOT NULL,
    "reason"     TEXT,
    "hours"      DOUBLE PRECISION NOT NULL,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planningId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    CONSTRAINT "planning_absences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex unique
CREATE UNIQUE INDEX "planning_participants_planningId_employerId_key" ON "planning_participants"("planningId", "employerId");
CREATE UNIQUE INDEX "planning_tasks_planningId_taskId_key" ON "planning_tasks"("planningId", "taskId");
CREATE UNIQUE INDEX "planning_votes_planningId_taskId_voterId_round_key" ON "planning_votes"("planningId", "taskId", "voterId", "round");
CREATE UNIQUE INDEX "planning_capacity_planningId_key" ON "planning_capacity"("planningId");

-- AddForeignKey: plannings
ALTER TABLE "plannings" ADD CONSTRAINT "plannings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plannings" ADD CONSTRAINT "plannings_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plannings" ADD CONSTRAINT "plannings_facilitatorId_fkey" FOREIGN KEY ("facilitatorId") REFERENCES "employers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "plannings" ADD CONSTRAINT "plannings_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: planning_participants
ALTER TABLE "planning_participants" ADD CONSTRAINT "planning_participants_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "planning_participants" ADD CONSTRAINT "planning_participants_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: planning_tasks
ALTER TABLE "planning_tasks" ADD CONSTRAINT "planning_tasks_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "planning_tasks" ADD CONSTRAINT "planning_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "planning_tasks" ADD CONSTRAINT "planning_tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "employers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "planning_tasks" ADD CONSTRAINT "planning_tasks_handoffId_fkey" FOREIGN KEY ("handoffId") REFERENCES "design_handoffs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: planning_votes
ALTER TABLE "planning_votes" ADD CONSTRAINT "planning_votes_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "planning_votes" ADD CONSTRAINT "planning_votes_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "planning_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "planning_votes" ADD CONSTRAINT "planning_votes_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: planning_capacity
ALTER TABLE "planning_capacity" ADD CONSTRAINT "planning_capacity_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: planning_rites
ALTER TABLE "planning_rites" ADD CONSTRAINT "planning_rites_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: planning_intruders
ALTER TABLE "planning_intruders" ADD CONSTRAINT "planning_intruders_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: planning_absences
ALTER TABLE "planning_absences" ADD CONSTRAINT "planning_absences_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "planning_absences" ADD CONSTRAINT "planning_absences_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
