-- Media System V1: simpan foto khusus pasangan + Cloudinary public_id
ALTER TABLE "invitations"
  ADD COLUMN "coverImagePublicId" TEXT,
  ADD COLUMN "groomPhotoUrl" TEXT,
  ADD COLUMN "groomPhotoPublicId" TEXT,
  ADD COLUMN "bridePhotoUrl" TEXT,
  ADD COLUMN "bridePhotoPublicId" TEXT;

ALTER TABLE "galleries"
  ADD COLUMN "imagePublicId" TEXT;
