-- Template Settings / Customization V1
ALTER TABLE "settings"
  ADD COLUMN "showStory" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "showVideo" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "templateVariant" TEXT,
  ADD COLUMN "accentColor" TEXT;
