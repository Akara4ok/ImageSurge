-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_ProjectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectProcessing" DROP CONSTRAINT "ProjectProcessing_ProjectId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_ProjectId_fkey";

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectProcessing" ADD CONSTRAINT "ProjectProcessing_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
