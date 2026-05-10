# Bugfix: Course Deletion Foreign Key Constraint

**Bugfix ID:** BF-001  
**Status:** Resolved  
**Date:** 2026-05-09  
**Severity:** High  
**Affected Page:** `/admin/courses`

---

## Problem Statement

Admin tidak dapat menghapus kursus yang sudah dibuat. Ketika tombol delete diklik dan dikonfirmasi, sistem gagal menghapus kursus dan tidak menampilkan pesan error yang jelas.

## Root Cause

Database PostgreSQL menolak penghapusan kursus karena ada data lain yang masih merujuk (foreign key constraint) ke tabel `Course`:

1. **Tabel `Student`** — kolom `selectedCourseId` merujuk ke `Course.id`
2. **Tabel `Schedule`** — kolom `courseId` merujuk ke `Course.id`
3. **Tabel `ScheduleStudent`** — merujuk ke `Schedule.id` (indirect)

Ketika database query DELETE dijalankan langsung ke tabel `Course`, PostgreSQL throw `Foreign key constraint violated` karena record-referensi tersebut masih ada.

## Solution

Mengubah logika penghapusan kursus di API route `/api/courses/[id]/route.ts` agar melakukan pembersihan relasi secara manual sebelum menghapus kursus:

### Before
```typescript
// Prisma: single query — fails due to FK constraint
await prisma.course.delete({ where: { id } })
```

### After (Drizzle ORM)
```typescript
import { db } from '@/lib/db'
import { courses, students, schedules, scheduleStudents } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Step 1: Unlink students
await db.update(students)
  .set({ selectedCourseId: null })
  .where(eq(students.selectedCourseId, id))

// Step 2: Delete junction + schedules
const schedRecords = await db.select({ id: schedules.id })
  .from(schedules)
  .where(eq(schedules.courseId, id))
for (const s of schedRecords) {
  await db.delete(scheduleStudents).where(eq(scheduleStudents.scheduleId, s.id))
}
await db.delete(schedules).where(eq(schedules.courseId, id))

// Step 3: Now safe to delete the course
await db.delete(courses).where(eq(courses.id, id))
```

## Execution Order

1. `update(students).set(selectedCourseId: null)` — Lepas relasi siswa dari kursus
2. `delete(scheduleStudents)` + `delete(schedules)` — Hapus jadwal + junction table (manual cascade)
3. `delete(courses)` — Hapus kursus itu sendiri

## Testing

- **Scenario:** Buat kursus → tambah siswa dengan kursus tersebut → tambah jadwal untuk kursus tersebut → hapus kursus
- **Expected:** Kursus terhapus, siswa tetap ada tetapi `selectedCourseId = null`, jadwal terhapus
- **Actual:** Berhasil ✅

## Files Modified

- `src/app/api/courses/[id]/route.ts`

## Related Requirements

- FR-ADM-C-04 (Hapus Kursus)

---

*End of Bugfix Documentation*
