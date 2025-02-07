/*
  Warnings:

  - The primary key for the `room` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "location" DROP CONSTRAINT "location_roomId_fkey";

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "roomId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "room" DROP CONSTRAINT "room_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "room_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "room_id_seq";

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
