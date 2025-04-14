-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_locationid_fkey";

-- AlterTable
ALTER TABLE "item" ALTER COLUMN "locationid" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_locationid_fkey" FOREIGN KEY ("locationid") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
