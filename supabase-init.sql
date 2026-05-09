-- ESK Platform: Initial Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS "ScheduleStudent" CASCADE;
DROP TABLE IF EXISTS "Schedule" CASCADE;
DROP TABLE IF EXISTS "Student" CASCADE;
DROP TABLE IF EXISTS "Course" CASCADE;
DROP TABLE IF EXISTS "Content" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;
DROP TABLE IF EXISTS "WhatsAppConfig" CASCADE;

-- Drop existing enum types
DROP TYPE IF EXISTS "ModeAvailable" CASCADE;
DROP TYPE IF EXISTS "StudentMode" CASCADE;
DROP TYPE IF EXISTS "StudentStatus" CASCADE;
DROP TYPE IF EXISTS "ScheduleMode" CASCADE;
DROP TYPE IF EXISTS "ContentType" CASCADE;
DROP TYPE IF EXISTS "AdminRole" CASCADE;

-- Create enum types
CREATE TYPE "ModeAvailable" AS ENUM ('online', 'offline', 'both');
CREATE TYPE "StudentMode" AS ENUM ('online', 'offline');
CREATE TYPE "StudentStatus" AS ENUM ('aktif', 'tidak_aktif', 'trial');
CREATE TYPE "ScheduleMode" AS ENUM ('online', 'offline');
CREATE TYPE "ContentType" AS ENUM ('text', 'rich_text', 'json');
CREATE TYPE "AdminRole" AS ENUM ('admin');

-- Course table
CREATE TABLE "Course" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "basePrice" DECIMAL(10,0) NOT NULL,
  "discountRate" DECIMAL(3,2) NOT NULL DEFAULT 0,
  "numberOfSessions" INTEGER NOT NULL,
  "modeAvailable" "ModeAvailable" NOT NULL DEFAULT 'both',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Student table
CREATE TABLE "Student" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "selectedCourseId" UUID REFERENCES "Course"("id"),
  "mode" "StudentMode" NOT NULL DEFAULT 'online',
  "referralCode" TEXT,
  "status" "StudentStatus" NOT NULL DEFAULT 'aktif',
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Schedule table
CREATE TABLE "Schedule" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "courseId" UUID NOT NULL REFERENCES "Course"("id"),
  "date" TIMESTAMPTZ NOT NULL,
  "startTime" TIMESTAMPTZ NOT NULL,
  "endTime" TIMESTAMPTZ NOT NULL,
  "meetingNumber" INTEGER NOT NULL,
  "zoomLink" TEXT,
  "mode" "ScheduleMode" NOT NULL DEFAULT 'online',
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ScheduleStudent junction table
CREATE TABLE "ScheduleStudent" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "scheduleId" UUID NOT NULL REFERENCES "Schedule"("id") ON DELETE CASCADE,
  "studentId" UUID NOT NULL REFERENCES "Student"("id") ON DELETE CASCADE,
  CONSTRAINT "ScheduleStudent_scheduleId_studentId_key" UNIQUE ("scheduleId", "studentId")
);

-- Content table
CREATE TABLE "Content" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "section" TEXT NOT NULL,
  "contentType" "ContentType" NOT NULL DEFAULT 'rich_text',
  "content" TEXT NOT NULL,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin table
CREATE TABLE "Admin" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" "AdminRole" NOT NULL DEFAULT 'admin',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- WhatsAppConfig table
CREATE TABLE "WhatsAppConfig" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "adminPhone" TEXT NOT NULL,
  "messageTemplate" TEXT NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_Course_isActive" ON "Course"("isActive");
CREATE INDEX IF NOT EXISTS "idx_Student_selectedCourseId" ON "Student"("selectedCourseId");
CREATE INDEX IF NOT EXISTS "idx_Student_phone" ON "Student"("phone");
CREATE INDEX IF NOT EXISTS "idx_Schedule_courseId" ON "Schedule"("courseId");
CREATE INDEX IF NOT EXISTS "idx_Schedule_date" ON "Schedule"("date");
CREATE INDEX IF NOT EXISTS "idx_ScheduleStudent_scheduleId" ON "ScheduleStudent"("scheduleId");
CREATE INDEX IF NOT EXISTS "idx_ScheduleStudent_studentId" ON "ScheduleStudent"("studentId");
CREATE INDEX IF NOT EXISTS "idx_Content_section" ON "Content"("section");
CREATE INDEX IF NOT EXISTS "idx_Admin_email" ON "Admin"("email");

-- Enable Row Level Security (Supabase best practice)
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Student" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Schedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ScheduleStudent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WhatsAppConfig" ENABLE ROW LEVEL SECURITY;

-- RLS Policies: allow anon and authenticated users to read public data
CREATE POLICY "Allow public read on Course" ON "Course" FOR SELECT USING (true);
CREATE POLICY "Allow public read on Schedule" ON "Schedule" FOR SELECT USING (true);
CREATE POLICY "Allow public read on Content" ON "Content" FOR SELECT USING (true);

-- RLS Policies: allow service role full access to all tables
CREATE POLICY "Service role full access on Course" ON "Course" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on Student" ON "Student" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on Schedule" ON "Schedule" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on ScheduleStudent" ON "ScheduleStudent" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on Content" ON "Content" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on Admin" ON "Admin" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on WhatsAppConfig" ON "WhatsAppConfig" FOR ALL USING (auth.role() = 'service_role');

-- Trigger to update updatedAt timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "Course_updatedAt" BEFORE UPDATE ON "Course" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Student_updatedAt" BEFORE UPDATE ON "Student" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Schedule_updatedAt" BEFORE UPDATE ON "Schedule" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "ScheduleStudent_updatedAt" BEFORE UPDATE ON "ScheduleStudent" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Content_updatedAt" BEFORE UPDATE ON "Content" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Admin_updatedAt" BEFORE UPDATE ON "Admin" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "WhatsAppConfig_updatedAt" BEFORE UPDATE ON "WhatsAppConfig" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();