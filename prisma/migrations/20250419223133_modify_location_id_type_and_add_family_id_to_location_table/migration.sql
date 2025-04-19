/*
  Warnings:

  - The primary key for the `location` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_locationid_fkey";

-- AlterTable
ALTER TABLE "item" ALTER COLUMN "locationid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "location" DROP CONSTRAINT "location_pkey",
ADD COLUMN     "familyId" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "location_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "location_id_seq";

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_locationid_fkey" FOREIGN KEY ("locationid") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
