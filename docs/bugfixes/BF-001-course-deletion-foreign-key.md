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

Ketika Prisma mengeksekusi `prisma.course.delete({ where: { id } })`, database throw `Foreign key constraint violated on the field` karena record-referensi tersebut masih ada.

## Solution

Mengubah logika penghapusan kursus di API route `/api/courses/[id]/route.ts` agar melakukan pembersihan relasi secara manual sebelum menghapus kursus:

### Before
```typescript
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await prisma.course.delete({ where: { id } })
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus kursus' }, { status: 500 })
  }
}
```

### After
```typescript
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    // Step 1: Unlink students from this course
    await prisma.student.updateMany({
      where: { selectedCourseId: id },
      data: { selectedCourseId: null },
    })

    // Step 2: Delete all schedules linked to this course
    await prisma.schedule.deleteMany({ where: { courseId: id } })

    // Step 3: Now safe to delete the course
    await prisma.course.delete({ where: { id } })

    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus kursus' }, { status: 500 })
  }
}
```

## Execution Order

1. `student.updateMany` — Set `selectedCourseId` ke `null` untuk semua siswa yang terdaftar di kursus ini
2. `schedule.deleteMany` — Hapus semua jadwal yang terkait dengan kursus ini (cascade ke `ScheduleStudent` otomatis oleh Prisma)
3. `course.delete` — Hapus kursus itu sendiri

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
