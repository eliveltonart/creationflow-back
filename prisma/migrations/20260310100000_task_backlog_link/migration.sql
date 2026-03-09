-- AlterTable
ALTER TABLE "tasks" ADD COLUMN "backlogItemId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tasks_backlogItemId_key" ON "tasks"("backlogItemId");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_backlogItemId_fkey" FOREIGN KEY ("backlogItemId") REFERENCES "backlog_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
