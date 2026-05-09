# Bugfix: Cursor Pointer on All Button Elements

**Bugfix ID:** BF-005  
**Status:** Resolved  
**Date:** 2026-05-09  
**Severity:** Low  
**Affected:** All pages and components with `<button>` elements

---

## Problem Statement

Tombol-tombol di seluruh aplikasi tidak menampilkan hand cursor (pointer) saat di-hover. Sebaliknya, cursor tetap default (arrow), yang membuat elemen button terlihat kurang interaktif dan mengurangi affordance bagi user.

## Root Cause

Tailwind CSS v4 preflight stylesheet men-set `button { cursor: default; }`, yang menimpa browser default `cursor: pointer` untuk tombol. Class `cursor-pointer` harus ditambahkan secara eksplisit ke setiap elemen button karena aturan global di `@layer base` tidak efektif melawan preflight.

## Attempted Solution (Tidak Berhasil)

Pertama mencoba menambahkan rule global di `globals.css`:

```css
@layer base {
  button {
    cursor: pointer;
  }
}
```

Namun Tailwind v4 preflight memiliki spesifisitas lebih tinggi dan menimpa rule ini, sehingga tidak berpengaruh di browser.

## Final Solution

Menambahkan class `cursor-pointer` secara eksplisit ke setiap elemen `<button>` di seluruh codebase:

### Pages & Components Updated

| File | Jumlah Button |
|------|---------------|
| `src/components/admin/admin-sidebar.tsx` | 1 (Keluar) |
| `src/app/admin/(dashboard)/courses/page.tsx` | 6 (Tambah, Edit, Delete, Batal, Hapus, Submit) |
| `src/app/admin/(dashboard)/students/page.tsx` | 6 (Tambah, Edit, Delete, Batal, Hapus, Submit) |
| `src/app/admin/(dashboard)/schedules/page.tsx` | 7 (Tambah, Close, Delete, Batal, Submit, Batal confirm, Hapus confirm) |
| `src/app/admin/(dashboard)/settings/page.tsx` | 3 (Simpan WA, Simpan Profil, Hapus Semua Data) |
| `src/app/admin/(dashboard)/content/page.tsx` | 1 (Simpan per section) |
| `src/components/landing/landing-client.tsx` | 1 (Daftar Sekarang) |
| `src/components/landing/registration-form.tsx` | 2 (Tutup, Submit) |
| `src/components/landing/course-card.tsx` | 1 (Daftar Sekarang) |
| `src/components/admin/admin-login-form.tsx` | 1 (Masuk) |

### Total: ~35 button elements updated

## Pattern Applied

Semua tombol dengan class Tailwind kini menyertakan `cursor-pointer` di dalam className string:

```tsx
<button className="... hover:bg-[var(--color-primary-dark)] transition-all cursor-pointer">
  Label
</button>
```

Tombol yang memiliki `disabled:cursor-not-allowed` tetap mendapatkan `cursor-pointer` di state non-disabled.

## Files Modified

- `src/app/globals.css` — removed ineffective global `button { cursor: pointer; }`
- `src/components/admin/admin-sidebar.tsx`
- `src/app/admin/(dashboard)/courses/page.tsx`
- `src/app/admin/(dashboard)/students/page.tsx`
- `src/app/admin/(dashboard)/schedules/page.tsx`
- `src/app/admin/(dashboard)/settings/page.tsx`
- `src/app/admin/(dashboard)/content/page.tsx`
- `src/components/landing/landing-client.tsx`
- `src/components/landing/registration-form.tsx`
- `src/components/landing/course-card.tsx`
- `src/components/admin/admin-login-form.tsx`

## Related Requirements

- FR-UI-04 (Cursor Pointer)

---

*End of Bugfix Documentation*
