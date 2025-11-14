/*
  Warnings:

  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "location" TEXT,
ADD COLUMN     "phone_no" TEXT,
ALTER COLUMN "password" SET NOT NULL;
