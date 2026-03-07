-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('SITE', 'FTP', 'DATABASE', 'LOGIN', 'API_KEY', 'SSH', 'TOOL');

-- CreateEnum
CREATE TYPE "public"."ResourceVisibility" AS ENUM ('COMPANY', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "public"."HandoffStatus" AS ENUM ('DRAFT', 'READY', 'IMPLEMENTING', 'IMPLEMENTED', 'APPROVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."RetroStatus" AS ENUM ('DRAFT', 'COLECT', 'VOTE', 'ACT', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."RetroCardCategory" AS ENUM ('WENT_WELL', 'NEEDS_IMPROVEMENT', 'ACTION_ITEMS');

-- CreateEnum
CREATE TYPE "public"."ContractType" AS ENUM ('CLT', 'PJ', 'FREELANCER', 'INTERN', 'APPRENTICE', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "public"."EmployerStatus" AS ENUM ('PRE_ONBOARDING', 'ONBOARDING', 'ACTIVE', 'OFFBOARDING', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."WorkRegime" AS ENUM ('IN_PERSON', 'REMOTE', 'HYBRID');

-- CreateEnum
CREATE TYPE "public"."WorkModality" AS ENUM ('IN_PERSON', 'REMOTE', 'HYBRID');

-- CreateEnum
CREATE TYPE "public"."CompanyRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'FINANCE_MANAGER', 'PROJECT_MANAGER', 'TEAM_LEAD', 'SENIOR_MEMBER', 'MEMBER', 'JUNIOR_MEMBER', 'CONTRACTOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."SkillType" AS ENUM ('TECHNICAL', 'BEHAVIORAL', 'LANGUAGE', 'TOOL');

-- CreateEnum
CREATE TYPE "public"."SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateTable
CREATE TABLE "public"."resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "favicon" TEXT,
    "type" "public"."ResourceType" NOT NULL,
    "fields" TEXT NOT NULL,
    "notes" TEXT,
    "visibility" "public"."ResourceVisibility" NOT NULL DEFAULT 'COMPANY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resource_access" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "resource_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."design_handoffs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."HandoffStatus" NOT NULL DEFAULT 'DRAFT',
    "rationale" TEXT,
    "userJourneyContext" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "iterationCount" INTEGER NOT NULL DEFAULT 0,
    "gapValidationErrors" BOOLEAN NOT NULL DEFAULT false,
    "gapValidationErrorsNA" BOOLEAN NOT NULL DEFAULT false,
    "gapErrorPages" BOOLEAN NOT NULL DEFAULT false,
    "gapErrorPagesNA" BOOLEAN NOT NULL DEFAULT false,
    "gapAlerts" BOOLEAN NOT NULL DEFAULT false,
    "gapAlertsNA" BOOLEAN NOT NULL DEFAULT false,
    "gapLoadingStates" BOOLEAN NOT NULL DEFAULT false,
    "gapLoadingStatesNA" BOOLEAN NOT NULL DEFAULT false,
    "gapEmptyStates" BOOLEAN NOT NULL DEFAULT false,
    "gapEmptyStatesNA" BOOLEAN NOT NULL DEFAULT false,
    "gapComponentStates" BOOLEAN NOT NULL DEFAULT false,
    "gapComponentStatesNA" BOOLEAN NOT NULL DEFAULT false,
    "gapPasswordReset" BOOLEAN NOT NULL DEFAULT false,
    "gapPasswordResetNA" BOOLEAN NOT NULL DEFAULT false,
    "gapResponsive" BOOLEAN NOT NULL DEFAULT false,
    "gapResponsiveNA" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "designerId" TEXT NOT NULL,
    "developerId" TEXT,

    CONSTRAINT "design_handoffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."handoff_components" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "usage" TEXT,
    "figmaLink" TEXT,
    "notes" TEXT,
    "variants" JSONB,
    "states" JSONB,
    "styles" JSONB,
    "responsiveSpecs" JSONB,
    "accessibilityNotes" TEXT,
    "wcagLevel" TEXT,
    "codeSnippets" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "handoffId" TEXT NOT NULL,

    CONSTRAINT "handoff_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."handoff_comments" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "handoffId" TEXT NOT NULL,
    "componentId" TEXT,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "handoff_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."handoff_linked_tasks" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handoffId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "handoff_linked_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."retrospectives" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."RetroStatus" NOT NULL DEFAULT 'DRAFT',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "voteLimit" INTEGER NOT NULL DEFAULT 5,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT NOT NULL,
    "col1Name" TEXT NOT NULL DEFAULT 'Went Well',
    "col1Color" TEXT NOT NULL DEFAULT '#22c55e',
    "col2Name" TEXT NOT NULL DEFAULT 'Needs Improvement',
    "col2Color" TEXT NOT NULL DEFAULT '#f97316',
    "col3Name" TEXT NOT NULL DEFAULT 'Action Items',
    "col3Color" TEXT NOT NULL DEFAULT '#3b82f6',
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "facilitatorId" TEXT NOT NULL,
    "sprintId" TEXT,
    "taskId" TEXT,

    CONSTRAINT "retrospectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."retro_cards" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "public"."RetroCardCategory" NOT NULL,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "retroId" TEXT NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "retro_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."retro_votes" (
    "id" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cardId" TEXT NOT NULL,
    "voterId" TEXT,
    "guestId" TEXT,

    CONSTRAINT "retro_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."retro_actions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "retroId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "taskId" TEXT,

    CONSTRAINT "retro_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."retro_participants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "guestId" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retroId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "retro_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "companyId" TEXT NOT NULL,
    "parentId" TEXT,
    "managerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."positions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" TEXT,
    "companyId" TEXT NOT NULL,
    "departmentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employers" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "socialName" TEXT,
    "emailPersonal" TEXT,
    "emailCorporate" TEXT NOT NULL,
    "phonePersonal" TEXT,
    "phoneCorporate" TEXT,
    "birthDate" TIMESTAMP(3),
    "gender" TEXT,
    "nationality" TEXT,
    "cpf" TEXT,
    "rg" TEXT,
    "addressCep" TEXT,
    "addressStreet" TEXT,
    "addressNumber" TEXT,
    "addressComplement" TEXT,
    "addressNeighborhood" TEXT,
    "addressCity" TEXT,
    "addressState" TEXT,
    "addressCountry" TEXT,
    "emergencyName" TEXT,
    "emergencyRelation" TEXT,
    "emergencyPhone" TEXT,
    "contractType" "public"."ContractType" NOT NULL DEFAULT 'CLT',
    "admissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "terminationDate" TIMESTAMP(3),
    "status" "public"."EmployerStatus" NOT NULL DEFAULT 'ONBOARDING',
    "workRegime" "public"."WorkRegime" NOT NULL DEFAULT 'REMOTE',
    "weeklyHours" INTEGER NOT NULL DEFAULT 40,
    "workModality" "public"."WorkModality" NOT NULL DEFAULT 'REMOTE',
    "departmentId" TEXT,
    "positionId" TEXT,
    "level" TEXT,
    "managerId" TEXT,
    "salary" DOUBLE PRECISION,
    "salaryCurrency" TEXT DEFAULT 'BRL',
    "salaryPeriod" TEXT,
    "hourlyRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employer_roles" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" "public"."CompanyRole" NOT NULL,
    "grantedBy" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "employer_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employer_skills" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "skillType" "public"."SkillType" NOT NULL DEFAULT 'TECHNICAL',
    "level" "public"."SkillLevel" NOT NULL DEFAULT 'INTERMEDIATE',
    "isCertified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employer_skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resource_access_resourceId_userId_key" ON "public"."resource_access"("resourceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "handoff_linked_tasks_handoffId_taskId_key" ON "public"."handoff_linked_tasks"("handoffId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "retrospectives_shareToken_key" ON "public"."retrospectives"("shareToken");

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resource_access" ADD CONSTRAINT "resource_access_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resource_access" ADD CONSTRAINT "resource_access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."design_handoffs" ADD CONSTRAINT "design_handoffs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."design_handoffs" ADD CONSTRAINT "design_handoffs_designerId_fkey" FOREIGN KEY ("designerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."design_handoffs" ADD CONSTRAINT "design_handoffs_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."handoff_components" ADD CONSTRAINT "handoff_components_handoffId_fkey" FOREIGN KEY ("handoffId") REFERENCES "public"."design_handoffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."handoff_comments" ADD CONSTRAINT "handoff_comments_handoffId_fkey" FOREIGN KEY ("handoffId") REFERENCES "public"."design_handoffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."handoff_comments" ADD CONSTRAINT "handoff_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."handoff_comments" ADD CONSTRAINT "handoff_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."handoff_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."handoff_linked_tasks" ADD CONSTRAINT "handoff_linked_tasks_handoffId_fkey" FOREIGN KEY ("handoffId") REFERENCES "public"."design_handoffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."handoff_linked_tasks" ADD CONSTRAINT "handoff_linked_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retrospectives" ADD CONSTRAINT "retrospectives_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retrospectives" ADD CONSTRAINT "retrospectives_facilitatorId_fkey" FOREIGN KEY ("facilitatorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retrospectives" ADD CONSTRAINT "retrospectives_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "public"."sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retrospectives" ADD CONSTRAINT "retrospectives_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retro_cards" ADD CONSTRAINT "retro_cards_retroId_fkey" FOREIGN KEY ("retroId") REFERENCES "public"."retrospectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retro_cards" ADD CONSTRAINT "retro_cards_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retro_votes" ADD CONSTRAINT "retro_votes_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."retro_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retro_votes" ADD CONSTRAINT "retro_votes_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retro_actions" ADD CONSTRAINT "retro_actions_retroId_fkey" FOREIGN KEY ("retroId") REFERENCES "public"."retrospectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retro_actions" ADD CONSTRAINT "retro_actions_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."retro_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retro_actions" ADD CONSTRAINT "retro_actions_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retro_actions" ADD CONSTRAINT "retro_actions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retro_participants" ADD CONSTRAINT "retro_participants_retroId_fkey" FOREIGN KEY ("retroId") REFERENCES "public"."retrospectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retro_participants" ADD CONSTRAINT "retro_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."departments" ADD CONSTRAINT "departments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."departments" ADD CONSTRAINT "departments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."departments" ADD CONSTRAINT "departments_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."employers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."positions" ADD CONSTRAINT "positions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."positions" ADD CONSTRAINT "positions_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employers" ADD CONSTRAINT "employers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employers" ADD CONSTRAINT "employers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employers" ADD CONSTRAINT "employers_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employers" ADD CONSTRAINT "employers_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "public"."positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employers" ADD CONSTRAINT "employers_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."employers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employer_roles" ADD CONSTRAINT "employer_roles_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "public"."employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employer_skills" ADD CONSTRAINT "employer_skills_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "public"."employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
