# Bugfix: Loading States on All CRUD Action Buttons

**Bugfix ID:** BF-003  
**Status:** Resolved  
**Date:** 2026-05-09  
**Severity:** Medium  
**Affected Pages:** `/admin/courses`, `/admin/students`, `/admin/schedules`

---

## Problem Statement

Tombol aksi di admin dashboard tidak memberikan feedback visual saat sedang memproses request API. Ketika admin mengklik tombol "Hapus", "Simpan", atau "Tambah", tidak ada indikasi bahwa sistem sedang bekerja. Hal ini menyebabkan:
- User mengklik tombol berkali-kali (double-submit)
- Tidak ada kejelasan apakah request sedang diproses
- User experience yang kurang responsif

## Root Cause

Handler async di frontend tidak menggunakan state loading. Tombol selalu dalam keadaan aktif dan tidak ada visual feedback selama proses network request.

## Solution

Menambahkan state loading pada semua tombol aksi di tiga halaman admin CRUD:

### 1. Delete Button in List Row

Setiap tombol delete (icon sampah) di baris tabel sekarang:
- Menggunakan state `deletingId` untuk tracking item yang sedang dihapus
- Menampilkan spinner SVG menggantikan icon delete saat loading
- Disabled saat proses berlangsung (`disabled:opacity-50`)

```tsx
{deletingId === item.id ? (
  <svg className="animate-spin w-4 h-4">...</svg>
) : (
  <svg className="w-4 h-4">...</svg> // delete icon
)}
```

### 2. Confirm Delete Button in Modal

Tombol "Hapus" di modal konfirmasi:
- Loading text: `"Menghapus..."` dengan spinner
- Background tetap red/error
- Disabled saat loading

### 3. Cancel Button in Modal

Tombol "Batal" di modal konfirmasi dan form:
- Disabled saat proses delete/submit berlangsung
- Mencegah user menutup modal secara tidak sengaja saat data sedang diproses

### 4. Submit Button in Form Modal

Tombol "Simpan" / "Tambah" di form:
- Sudah memiliki loading state sebelumnya (spinner + "Menyimpan...")
- Tetap dipertahankan dan ditingkatkan konsistensinya

### 5. Schedules Specific

Pada halaman jadwal, loading state juga diterapkan pada:
- Tombol "Hapus" di dalam form edit (sebelum konfirmasi)
- Tombol "Batal" dan "Hapus" di overlay konfirmasi

## State Management

| Page | Loading State | Scope |
|------|---------------|-------|
| Courses | `deletingId: string \| null` | Single item |
| Students | `deletingId: string \| null` | Single item |
| Schedules | `deleting: boolean` | Single schedule |

Semua menggunakan pattern: `setLoading(true)` → `await fetch()` → `setLoading(false)` di blok `finally`.

## Files Modified

- `src/app/admin/(dashboard)/courses/page.tsx`
- `src/app/admin/(dashboard)/students/page.tsx`
- `src/app/admin/(dashboard)/schedules/page.tsx`

## Related Requirements

- FR-UI-02 (Loading States)

---

*End of Bugfix Documentation*
