/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `commentContent` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `comment_id` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groupImageUrl` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `groupIsPublic` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `groupLikeCount` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `groupPostCount` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `Group` table. All the data in the column will be lost.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `postImageUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postIsPublic` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postLikeCount` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `Post` table. All the data in the column will be lost.
  - Added the required column `content` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Comment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Group` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `imageUrl` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPublic` to the `Group` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Post` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `imageUrl` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPublic` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_group_id_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "commentContent",
DROP COLUMN "comment_id",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Group" DROP CONSTRAINT "Group_pkey",
DROP COLUMN "groupImageUrl",
DROP COLUMN "groupIsPublic",
DROP COLUMN "groupLikeCount",
DROP COLUMN "groupPostCount",
DROP COLUMN "group_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "postCount" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "postImageUrl",
DROP COLUMN "postIsPublic",
DROP COLUMN "postLikeCount",
DROP COLUMN "post_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
