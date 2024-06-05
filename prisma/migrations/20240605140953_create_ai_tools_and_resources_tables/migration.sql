/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bio` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_image_url` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPERADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "profile_image_url" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN',
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ai-tool-categories" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ai-tool-categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai-tools" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "full_description" TEXT NOT NULL,
    "site_url" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "pricing_model" TEXT NOT NULL,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_alt" TEXT,
    "yt_video_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ai-tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource-categories" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "resource-categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "full_description" TEXT NOT NULL,
    "site_url" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "pricing_model" TEXT NOT NULL,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_alt" TEXT,
    "yt_video_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AiToolToAiToolCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ResourceToResourceCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ai-tools_slug_key" ON "ai-tools"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "resources_slug_key" ON "resources"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_AiToolToAiToolCategory_AB_unique" ON "_AiToolToAiToolCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_AiToolToAiToolCategory_B_index" ON "_AiToolToAiToolCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ResourceToResourceCategory_AB_unique" ON "_ResourceToResourceCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ResourceToResourceCategory_B_index" ON "_ResourceToResourceCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "ai-tool-categories" ADD CONSTRAINT "ai-tool-categories_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai-tools" ADD CONSTRAINT "ai-tools_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource-categories" ADD CONSTRAINT "resource-categories_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AiToolToAiToolCategory" ADD CONSTRAINT "_AiToolToAiToolCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "ai-tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AiToolToAiToolCategory" ADD CONSTRAINT "_AiToolToAiToolCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "ai-tool-categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToResourceCategory" ADD CONSTRAINT "_ResourceToResourceCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToResourceCategory" ADD CONSTRAINT "_ResourceToResourceCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "resource-categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
