-- CreateEnum
CREATE TYPE "BacklogItemType" AS ENUM ('FEATURE', 'BUG', 'TECH_DEBT', 'RESEARCH', 'DESIGN', 'INFRA');

-- CreateEnum
CREATE TYPE "BacklogItemStatus" AS ENUM ('BACKLOG', 'IN_SPRINT', 'DONE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BacklogRefinementStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'REFINED');

-- CreateEnum
CREATE TYPE "DependencyType" AS ENUM ('BLOCKS', 'RELATES_TO');

-- CreateEnum
CREATE TYPE "EpicStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "epics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "status" "EpicStatus" NOT NULL DEFAULT 'PLANNED',
    "targetDate" TIMESTAMP(3),
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "epics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backlog_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "BacklogItemType" NOT NULL DEFAULT 'FEATURE',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "BacklogItemStatus" NOT NULL DEFAULT 'BACKLOG',
    "storyPoints" INTEGER,
    "hoursEstimated" DECIMAL(10,2),
    "refinementStatus" "BacklogRefinementStatus" NOT NULL DEFAULT 'PENDING',
    "refinementNotes" TEXT,
    "refinedAt" TIMESTAMP(3),
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "epicId" TEXT,
    "sprintId" TEXT,
    "assigneeId" TEXT,
    "refinedById" TEXT,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "backlog_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backlog_acceptance_criteria" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "backlogItemId" TEXT NOT NULL,

    CONSTRAINT "backlog_acceptance_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backlog_dependencies" (
    "id" TEXT NOT NULL,
    "type" "DependencyType" NOT NULL DEFAULT 'RELATES_TO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "backlogItemId" TEXT NOT NULL,
    "dependsOnId" TEXT NOT NULL,

    CONSTRAINT "backlog_dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backlog_views" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "backlog_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backlog_history" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "backlogItemId" TEXT NOT NULL,
    "performedById" TEXT NOT NULL,

    CONSTRAINT "backlog_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "backlog_dependencies_backlogItemId_dependsOnId_key" ON "backlog_dependencies"("backlogItemId", "dependsOnId");

-- AddForeignKey
ALTER TABLE "epics" ADD CONSTRAINT "epics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "epics" ADD CONSTRAINT "epics_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "employers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_items" ADD CONSTRAINT "backlog_items_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_items" ADD CONSTRAINT "backlog_items_epicId_fkey" FOREIGN KEY ("epicId") REFERENCES "epics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_items" ADD CONSTRAINT "backlog_items_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_items" ADD CONSTRAINT "backlog_items_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "employers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_items" ADD CONSTRAINT "backlog_items_refinedById_fkey" FOREIGN KEY ("refinedById") REFERENCES "employers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_items" ADD CONSTRAINT "backlog_items_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "employers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_acceptance_criteria" ADD CONSTRAINT "backlog_acceptance_criteria_backlogItemId_fkey" FOREIGN KEY ("backlogItemId") REFERENCES "backlog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_dependencies" ADD CONSTRAINT "backlog_dependencies_backlogItemId_fkey" FOREIGN KEY ("backlogItemId") REFERENCES "backlog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_dependencies" ADD CONSTRAINT "backlog_dependencies_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "backlog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_views" ADD CONSTRAINT "backlog_views_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_views" ADD CONSTRAINT "backlog_views_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "employers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_history" ADD CONSTRAINT "backlog_history_backlogItemId_fkey" FOREIGN KEY ("backlogItemId") REFERENCES "backlog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlog_history" ADD CONSTRAINT "backlog_history_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "employers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
