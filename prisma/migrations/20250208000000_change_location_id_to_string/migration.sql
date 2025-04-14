-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_locationid_fkey";

-- AlterTable
ALTER TABLE "location" DROP CONSTRAINT "location_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "location_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "item" ALTER COLUMN "locationid" SET DATA TYPE VARCHAR(255);

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_locationid_fkey" FOREIGN KEY ("locationid") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE; 