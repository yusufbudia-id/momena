CREATE TABLE "invitation_events" (
 "id" TEXT NOT NULL, "invitationId" TEXT NOT NULL, "type" TEXT NOT NULL DEFAULT 'OTHER', "title" TEXT NOT NULL, "eventDate" TIMESTAMP(3), "startTime" TEXT, "endTime" TEXT, "location" TEXT, "address" TEXT, "mapsUrl" TEXT, "order" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "invitation_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "invitation_events_invitationId_idx" ON "invitation_events"("invitationId");
ALTER TABLE "invitation_events" ADD CONSTRAINT "invitation_events_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
INSERT INTO "invitation_events" ("id","invitationId","type","title","eventDate","location","address","mapsUrl","order","createdAt","updatedAt")
SELECT 'legacy_' || "id", "id", 'OTHER', 'Acara Utama', "eventDate", "eventLocation", "eventAddress", "eventMapsUrl", 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "invitations" WHERE "eventDate" IS NOT NULL OR "eventLocation" IS NOT NULL OR "eventAddress" IS NOT NULL OR "eventMapsUrl" IS NOT NULL;
