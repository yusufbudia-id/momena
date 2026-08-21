-- Focal Point V1: simpan posisi fokus foto dalam persen (0-100).
-- Default 50/50 menjaga tampilan invitation lama tetap center.
ALTER TABLE "invitations"
  ADD COLUMN "coverImagePositionX" INTEGER NOT NULL DEFAULT 50,
  ADD COLUMN "coverImagePositionY" INTEGER NOT NULL DEFAULT 50,
  ADD COLUMN "groomPhotoPositionX" INTEGER NOT NULL DEFAULT 50,
  ADD COLUMN "groomPhotoPositionY" INTEGER NOT NULL DEFAULT 50,
  ADD COLUMN "bridePhotoPositionX" INTEGER NOT NULL DEFAULT 50,
  ADD COLUMN "bridePhotoPositionY" INTEGER NOT NULL DEFAULT 50;
