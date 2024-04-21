-- CreateTable
CREATE TABLE "User" (
    "Id" UUID NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PhoneNumber" TEXT NOT NULL,
    "Country" TEXT NOT NULL,
    "Password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Project" (
    "Id" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "Status" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "Cropping" BOOLEAN NOT NULL,
    "SecretKey" TEXT NOT NULL,
    "NeuralNetworkId" UUID NOT NULL,
    "CroppingNetworkId" UUID,
    "ArtifactPath" TEXT NOT NULL,
    "Level" INTEGER,
    "Similarity" INTEGER,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Request" (
    "Id" UUID NOT NULL,
    "ProjectId" UUID NOT NULL,
    "Images" INTEGER NOT NULL,
    "ProcessingTime" INTEGER NOT NULL,
    "ValidationTime" INTEGER NOT NULL,
    "ClassifiactionTime" INTEGER NOT NULL,
    "CroppingTime" INTEGER NOT NULL,
    "Quality" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Log" (
    "Id" UUID NOT NULL,
    "ProjectId" UUID NOT NULL,
    "Value" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ProjectProcessing" (
    "Id" UUID NOT NULL,
    "ProjectId" UUID NOT NULL,
    "Value" TEXT NOT NULL,

    CONSTRAINT "ProjectProcessing_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Dataset" (
    "Id" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "ImagesNum" INTEGER NOT NULL,
    "CategoryId" UUID NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "ParentFolder" TEXT NOT NULL,
    "Source" INTEGER NOT NULL,

    CONSTRAINT "Dataset_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "NeuralNetwork" (
    "Id" UUID NOT NULL,
    "CategoryId" UUID NOT NULL,
    "KservePath" TEXT NOT NULL,
    "LocalKserve" BOOLEAN NOT NULL,
    "ModelId" UUID NOT NULL,

    CONSTRAINT "NeuralNetwork_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "KServeUrl" (
    "Id" UUID NOT NULL,
    "CategoryId" UUID NOT NULL,
    "ModelId" UUID NOT NULL,
    "UrlSuffix" TEXT NOT NULL,

    CONSTRAINT "KServeUrl_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Category" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Model" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "_DatasetToProject" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_Name_key" ON "Project"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Dataset_Name_key" ON "Dataset"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "_DatasetToProject_AB_unique" ON "_DatasetToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_DatasetToProject_B_index" ON "_DatasetToProject"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_Classification_fkey" FOREIGN KEY ("NeuralNetworkId") REFERENCES "NeuralNetwork"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_Cropping_fkey" FOREIGN KEY ("CroppingNetworkId") REFERENCES "NeuralNetwork"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectProcessing" ADD CONSTRAINT "ProjectProcessing_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeuralNetwork" ADD CONSTRAINT "NeuralNetwork_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeuralNetwork" ADD CONSTRAINT "NeuralNetwork_ModelId_fkey" FOREIGN KEY ("ModelId") REFERENCES "Model"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KServeUrl" ADD CONSTRAINT "KServeUrl_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KServeUrl" ADD CONSTRAINT "KServeUrl_ModelId_fkey" FOREIGN KEY ("ModelId") REFERENCES "Model"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DatasetToProject" ADD CONSTRAINT "_DatasetToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Dataset"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DatasetToProject" ADD CONSTRAINT "_DatasetToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
