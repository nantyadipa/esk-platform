-- CreateEnum
CREATE TYPE "ModeAvailable" AS ENUM ('online', 'offline', 'both');

-- CreateEnum
CREATE TYPE "StudentMode" AS ENUM ('online', 'offline');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('aktif', 'tidak_aktif', 'trial');

-- CreateEnum
CREATE TYPE "ScheduleMode" AS ENUM ('online', 'offline');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('text', 'rich_text', 'json');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('admin');

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "ScheduleStudent" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "scheduleId" UUID NOT NULL REFERENCES "Schedule"("id") ON DELETE CASCADE,
    "studentId" UUID NOT NULL REFERENCES "Student"("id") ON DELETE CASCADE,
    CONSTRAINT "ScheduleStudent_scheduleId_studentId_key" UNIQUE ("scheduleId", "studentId")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "section" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL DEFAULT 'rich_text',
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CreateTable
CREATE TABLE "WhatsAppConfig" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "adminPhone" TEXT NOT NULL,
    "messageTemplate" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);