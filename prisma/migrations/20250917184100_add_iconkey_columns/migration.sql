-- Add iconKey column to location table
ALTER TABLE "location"
ADD COLUMN "iconKey" VARCHAR(64);

-- Add iconKey column to item table
ALTER TABLE "item"
ADD COLUMN "iconKey" VARCHAR(64);