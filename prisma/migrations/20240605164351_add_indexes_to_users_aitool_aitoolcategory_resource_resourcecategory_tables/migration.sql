-- CreateIndex
CREATE INDEX "ai-tool-categories_id_idx" ON "ai-tool-categories"("id");

-- CreateIndex
CREATE INDEX "ai-tools_id_slug_idx" ON "ai-tools"("id", "slug");

-- CreateIndex
CREATE INDEX "resource-categories_id_idx" ON "resource-categories"("id");

-- CreateIndex
CREATE INDEX "resources_id_slug_idx" ON "resources"("id", "slug");

-- CreateIndex
CREATE INDEX "users_id_email_idx" ON "users"("id", "email");
