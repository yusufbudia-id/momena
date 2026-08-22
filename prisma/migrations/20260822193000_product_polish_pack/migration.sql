-- Template Settings V2 + Gift polish
ALTER TABLE "settings"
  ADD COLUMN "fontFamily" TEXT,
  ADD COLUMN "heroLayout" TEXT,
  ADD COLUMN "decorationLevel" TEXT NOT NULL DEFAULT 'medium';

ALTER TABLE "gifts"
  ADD COLUMN "qrImageUrl" TEXT,
  ADD COLUMN "qrImagePublicId" TEXT;
