-- CreateTable
CREATE TABLE "LoadStat" (
    "Id" UUID NOT NULL,
    "ProjectId" UUID NOT NULL,
    "LoadTime" TIMESTAMP(3) NOT NULL,
    "StopTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoadStat_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "LoadStat" ADD CONSTRAINT "LoadStat_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
