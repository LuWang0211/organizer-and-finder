
-- CreateTable
CREATE TABLE "house" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "metadata" JSONB,
    "familyId" INTEGER NOT NULL,

    CONSTRAINT "house_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "house" ADD CONSTRAINT "house_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert a default family if a user with id 1 exists
INSERT INTO "family" ("id", "name") VALUES (1, 'Family 1') ON CONFLICT DO NOTHING;

-- Insert a default house if a family with id 1 exists
INSERT INTO "house" ("name", "familyId") VALUES ('LOFT', 1) ON CONFLICT DO NOTHING;

-- AlterTable
ALTER TABLE "room" ADD COLUMN     "houseId" INTEGER default 1,
ADD COLUMN     "metadata" JSONB;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Set room houseID to not null
ALTER TABLE "room" ALTER COLUMN "houseId" SET NOT NULL;
ALTER TABLE "room" ALTER COLUMN "houseId" DROP DEFAULT;
