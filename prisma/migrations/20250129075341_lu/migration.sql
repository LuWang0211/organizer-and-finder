/*
  Warnings:

  - Added the required column `accountProvider` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "accountProvider" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
