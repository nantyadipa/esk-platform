# Bugfix: Admin Sidebar Active Menu Highlight

**Bugfix ID:** BF-004  
**Status:** Resolved  
**Date:** 2026-05-09  
**Severity:** Low  
**Affected Component:** `AdminSidebar`

---

## Problem Statement

Ketika admin berada di salah satu menu dashboard (misalnya "Jadwal"), tidak ada indikasi visual di sidebar yang menunjukkan menu mana yang sedang aktif. Semua menu link terlihat sama sehingga user sulit mengetahui posisi saat ini.

## Root Cause

Komponen `AdminSidebar` menggunakan elemen `<a>` dengan class statis yang sama untuk semua menu item. Tidak ada logika untuk menentukan menu mana yang sedang aktif berdasarkan current URL.

## Solution

Menggunakan `usePathname()` dari `next/navigation` untuk mendeteksi halaman aktif dan menerapkan style berbeda pada menu yang sedang dibuka.

### Implementation

```tsx
import { usePathname } from 'next/navigation'

const pathname = usePathname()

const isActive = (href: string) => {
  if (href === '/admin') return pathname === '/admin'
  return pathname.startsWith(href)
}
```

### Style Difference

| State | Class |
|-------|-------|
| **Active** | `bg-[var(--color-primary-ghost)] text-[var(--color-text-accent)] font-semibold` |
| **Inactive** | `text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-ghost)] hover:text-[var(--color-text-accent)]` |

### Special Case: Overview

Menu "Overview" (`/admin`) hanya di-highlight saat exact match `pathname === '/admin'`, bukan saat berada di submenu seperti `/admin/courses`. Ini mencegah Overview selalu terlihat aktif.

## Before

```tsx
<a className="block px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-ghost)] hover:text-[var(--color-text-accent)] transition-colors">
  {item.label}
</a>
```

## After

```tsx
<a className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
  isActive(item.href)
    ? 'bg-[var(--color-primary-ghost)] text-[var(--color-text-accent)] font-semibold'
    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-ghost)] hover:text-[var(--color-text-accent)]'
}`}>
  {item.label}
</a>
```

## Result

- Menu yang sedang aktif memiliki background ghost color
- Font menjadi bold (`font-semibold`)
- Warna text berubah menjadi accent color
- Transisi warna tetap smooth

## Files Modified

- `src/components/admin/admin-sidebar.tsx`

## Related Requirements

- FR-UI-03 (Sidebar Active Highlight)

---

*End of Bugfix Documentation*
