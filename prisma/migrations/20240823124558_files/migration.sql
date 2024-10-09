-- CreateTable
CREATE TABLE "Files" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "encrypted" BOOLEAN,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Files_description_key" ON "Files"("description");
