/*
  Warnings:

  - You are about to drop the column `Introuction` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `Password` on the `Group` table. All the data in the column will be lost.
  - Added the required column `Introduction` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "Introuction",
DROP COLUMN "Password",
ADD COLUMN     "Introduction" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;
