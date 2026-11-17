CREATE TYPE "ThemePreference" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');
ALTER TABLE "User" ADD COLUMN "theme" "ThemePreference" NOT NULL DEFAULT 'LIGHT';
