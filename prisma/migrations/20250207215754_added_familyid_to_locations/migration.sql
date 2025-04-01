-- AlterTable
ALTER TABLE "location" ADD COLUMN     "familyId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
