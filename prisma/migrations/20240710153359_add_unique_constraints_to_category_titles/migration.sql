/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `ai_tool_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `resource_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ai_tool_categories_title_key" ON "ai_tool_categories"("title");

-- CreateIndex
CREATE UNIQUE INDEX "resource_categories_title_key" ON "resource_categories"("title");
