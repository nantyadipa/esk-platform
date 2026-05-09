# Manual Test Cases - English Sepulang Kerja (ESK)

**Project:** ESK Platform - End-to-End Testing
**Date:** 2026-05-08
**Tester:** Anan TLab
**Document Version:** 1.1

---

## Overview

This document contains manual test cases based on the Epic and Story breakdown from `epics.md`. These test cases complement the Playwright E2E automation and are designed for manual execution.

---

## Automation Test Execution

### Cara Menjalankan Test Automation

Test automation menggunakan Playwright + pytest. Selector menggunakan pattern:
- **Exact match**: `[data-testid="nama-selector"]`
- **Prefix match (ID dinamis)**: `[data-testid^="prefix-"]`
  - Contoh: `course-card-{uuid}` => `[data-testid^="course-card-"]`

### Perintah Run Test

```bash
# Semua test
python -m pytest tests/tests/ -v

# Per Epic
python -m pytest tests/tests/test_epic1_landing_registration.py -v
python -m pytest tests/tests/test_epic2_admin_auth.py -v
python -m pytest tests/tests/test_epic3_course_management.py -v
python -m pytest tests/tests/test_epic4_student_management.py -v
python -m pytest tests/tests/test_epic5_schedule_management.py -v
python -m pytest tests/tests/test_epic6_content_management.py -v
python -m pytest tests/tests/test_epic7_settings.py -v

# Dengan HTML Report (otomatis di tests/reports/report.html)
python -m pytest tests/tests/ -v --html=tests/reports/report.html

# Smoke Tests Only
python -m pytest tests/tests/ -m smoke -v

# Regression Tests Only
python -m pytest tests/tests/ -m regression -v
```

### Hasil Report
- **HTML Report**: `tests/reports/report.html`
- **Screenshots (jika gagal)**: `tests/reports/screenshots/`
- **Console Logs**: `tests/reports/logs/`

---

## Epic 1: Landing Page & Pendaftaran

### TC-001: Landing Page Load
**Story:** 1.1
**Priority:** High
**Pre-condition:** Browser open, no cache

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `http://localhost:3000` | Landing page loads within 2 seconds |
| 2 | Check hero section visible | Hero title, subtitle, CTA button visible |
| 3 | Check course section visible | Course cards displayed |
| 4 | Check footer visible | Footer with copyright text |

**Acceptance Criteria:**
- ✅ LCP < 2 seconds
- ✅ All sections visible
- ✅ Rose Gold & Cream color scheme applied

---

### TC-002: Responsive Design - Mobile
**Story:** 1.2
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Chrome DevTools (F12) | DevTools opens |
| 2 | Set viewport to 375x667 (iPhone SE) | Viewport changes |
| 3 | Navigate to landing page | Page renders correctly |
| 4 | Check hero section | Title and CTA visible |
| 5 | Scroll down | Course cards visible |
| 6 | Check sticky CTA at bottom | Mobile CTA button sticky |

---

### TC-003: Responsive Design - Desktop
**Story:** 1.2
**Priority:** Medium

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Set viewport to 1920x1080 | Viewport changes |
| 2 | Navigate to landing page | Page renders correctly |
| 3 | Check layout | Full layout with sidebar nav (if any) |

---

### TC-004: Course Catalog Display
**Story:** 1.3
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Scroll to "Harga & Kelas" section | Course cards displayed |
| 2 | Count course cards | At least 1 course visible |
| 3 | Check each card | Card has name, price, description, CTA |

---

### TC-005: Course Price with Discount
**Story:** 1.4
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Find a course with discount | Original price struck through |
| 2 | Verify final price shown | Discounted price displayed |
| 3 | Calculate discount | Final = Base × (1 - Discount) |
| 4 | Check a course with 0% discount | Only base price shown, no strikethrough |
| 5 | Check a course with 100% discount | Shows "Gratis" or "Rp0" |

---

### TC-006: Registration Form Opens
**Story:** 1.5
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Daftar Sekarang" on a course card | Registration form appears |
| 2 | Check form fields | Name, WhatsApp, Class, Mode, Referral visible |
| 3 | Check class field | Class name pre-filled, read-only |

---

### TC-007: Registration Form Validation
**Story:** 1.6, 1.7, 1.8, 1.9
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Leave all fields empty | Validation errors shown |
| 2 | Fill name only | Name field accepts input |
| 3 | Fill invalid phone (< 8 digits) | Error: "No. WhatsApp tidak valid" |
| 4 | Check class field | Pre-filled, cannot edit manually |
| 5 | Select mode | Online/Offline radio button works |
| 6 | Fill referral code | Optional field accepts input |

---

### TC-008: Form Submission - WhatsApp Link
**Story:** 1.10, 1.11
**Priority:** Critical

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Fill all required fields | All fields accept input |
| 2 | Complete hCaptcha (if enabled) | hCaptcha challenge completed |
| 3 | Click "Daftar Sekarang" button | Loading state shown |
| 4 | Wait for WhatsApp link | Link appears within 3 seconds |
| 5 | Click WhatsApp link | WhatsApp opens with pre-filled message |

**Check message content:**
- Name field included ✓
- Phone field included ✓
- Class name included ✓
- Mode included ✓
- Referral code included (or "-") ✓

---

### TC-009: WhatsApp URL Generation
**Story:** 1.11, FR-C3
**Priority:** Critical

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Fill form and submit | Server-side generates URL |
| 2 | Check URL format | `https://wa.me/[phone]?text=[encoded]` |
| 3 | Verify phone number | Correct admin phone number |
| 4 | Verify message encoding | All special chars encoded |

---

## Epic 2: Admin Authentication

### TC-010: Admin Login Page Load
**Story:** 2.1
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/login` | Login page loads |
| 2 | Check form elements | Email and password fields visible |
| 3 | Check submit button | "Masuk" or similar button visible |

---

### TC-011: Admin Login - Valid Credentials
**Story:** 2.2
**Priority:** Critical

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter email: `admin@esk.id` | Email field accepts input |
| 2 | Enter password: `ESKadmin2026!` | Password field accepts input (masked) |
| 3 | Click submit button | Dashboard loads |
| 4 | Check URL | Redirected to `/admin` |
| 5 | Check sidebar | Sidebar navigation visible |

---

### TC-012: Admin Login - Invalid Credentials
**Story:** 2.3
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter wrong password | Password field accepts input |
| 2 | Click submit | Error message shown |
| 3 | Verify error message | "Email atau password salah" or similar |

---

### TC-013: Unauthenticated Access Redirect
**Story:** 2.5
**Priority:** Critical

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Clear all cookies/session | No admin session |
| 2 | Navigate to `/admin/courses` directly | Redirected to `/admin/login` |
| 3 | Try `/admin/students` | Redirected to `/admin/login` |
| 4 | Try `/admin/schedules` | Redirected to `/admin/login` |

---

### TC-014: Admin Logout
**Story:** 2.8
**Priority:** Medium

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click logout button in sidebar | Session cleared |
| 2 | Check URL | Redirected to `/admin/login` |
| 3 | Try accessing `/admin` again | Requires login |

---

## Epic 3: Manajemen Kursus

### TC-015: Course List Display
**Story:** 3.1
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as admin | Dashboard loads |
| 2 | Navigate to "Kelola Kursus" | Course table displayed |
| 3 | Check table headers | Nama, Harga, Pertemuan, Mode, Status, Aksi |

---

### TC-016: Add Course
**Story:** 3.2, 3.3, 3.4
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Tambah Kursus" button | Modal opens |
| 2 | Fill form: Name only | Validation error |
| 3 | Fill minimal: Name, Deskripsi, Harga, Pertemuan | Course saved |
| 4 | Fill all fields: Name, Desc, BasePrice, Discount, Sessions, Mode | Course saved |
| 5 | Close modal | Modal closes |
| 6 | Check course appears in list | New course visible |

**Test Data:**
```
Name: "TOEFL Preparation"
Description: "Kursus persiapan TOEFL intensif"
Base Price: 500000
Discount Rate: 10 (%)
Sessions: 8
Mode: Online & Offline
```

---

### TC-017: Edit Course
**Story:** 3.5
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click edit button on a course | Modal opens with data |
| 2 | Change name | Name updated |
| 3 | Change price | Price updated |
| 4 | Save | Changes saved |
| 5 | Verify on landing page | New price visible within 5s |

---

### TC-018: Delete Course
**Story:** 3.6
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click delete button | Confirmation dialog appears |
| 2 | Click "Batal" | Dialog closes, course not deleted |
| 3 | Click delete again | Confirmation appears |
| 4 | Click "Hapus" | Course deleted from list |

---

### TC-019: Discount Calculation
**Story:** 3.8, FR-C1
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create course with 0% discount | Final price = base price |
| 2 | Create course with 10% discount | Final = Base × 0.9 |
| 3 | Create course with 100% discount | Shows "Gratis" or "Rp0" |

**Test Data:**
| Base Price | Discount | Expected Final |
|------------|----------|----------------|
| 500,000 | 0% | Rp500,000 |
| 500,000 | 10% | Rp450,000 |
| 500,000 | 20% | Rp400,000 |
| 500,000 | 100% | Gratis |

---

### TC-020: Course on Landing Page
**Story:** 3.9, 3.10
**Priority:** Critical

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add new course in admin | Course saved |
| 2 | Open landing page | New course visible |
| 3 | Update course price | Price updates within 5s |
| 4 | Mark course inactive | Course hidden from landing |

---

## Epic 4: Manajemen Siswa

### TC-021: Student List Display
**Story:** 4.1
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to "Kelola Siswa" | Student table displayed |
| 2 | Check columns | Nama, Kursus, Mode, Status, Referral, Aksi |

---

### TC-022: Add Student
**Story:** 4.2, 4.3, 4.4
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Tambah Siswa" | Modal opens |
| 2 | Fill all fields | All fields accept input |
| 3 | Save | Student saved, modal closes |
| 4 | Verify in list | New student visible |

---

### TC-023: Search Students
**Story:** 4.7
**Priority:** Medium

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Type name in search field | List filters in real-time |
| 2 | Clear search | All students shown |

---

### TC-024: Filter Students
**Story:** 4.8, 4.9
**Priority:** Medium

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Select status filter | List shows only active students |
| 2 | Select course filter | List shows only selected course |
| 3 | Combine filters | Both filters applied |

---

### TC-025: Student Notes
**Story:** 4.10
**Priority:** Low

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add student with notes | Notes saved |
| 2 | Edit student | Notes can be updated |
| 3 | View student details | Notes displayed |

---

## Epic 5: Manajemen Jadwal & Kalender

### TC-026: Calendar View Display
**Story:** 5.1
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to "Kelola Jadwal" | Calendar displayed |
| 2 | Check default view | Month view (or default) |
| 3 | Check events | Events visible with color coding |

---

### TC-027: Add Schedule
**Story:** 5.2, 5.3
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Tambah Jadwal" | Modal opens |
| 2 | Fill all fields | All fields accept input |
| 3 | Select course | Course dropdown populated |
| 4 | Select students | Multi-select works |
| 5 | Save | Schedule saved, appears on calendar |

---

### TC-028: Calendar Navigation
**Story:** 5.6, 5.7
**Priority:** Medium

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Today" | Returns to current date |
| 2 | Click next/prev month | Month changes |
| 3 | Switch to week view | Week view displays |
| 4 | Switch to day view | Day view displays |

---

### TC-029: Calendar Color Coding
**Story:** 5.8
**Priority:** Medium

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Look at calendar events | Events colored by course type |
| 2 | Verify colors | Rose Gold = TOEFL, Mint = General, etc. |

---

### TC-030: Schedule Conflict
**Story:** 5.10
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create schedule at 19:00-21:00 | Saved successfully |
| 2 | Try to create another at 20:00-21:00 | Error: "Jadwal bentrok" |
| 3 | Try to create at 21:00-22:00 | Should succeed (adjacent) |

---

## Epic 6: Content Management (CMS)

### TC-031: Content Page Load
**Story:** 6.1
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to "Kelola Konten" | Content sections displayed |
| 2 | Check available sections | Hero Title, Subtitle, CTA, Footer visible |

---

### TC-032: Edit Hero Title
**Story:** 6.2
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Clear hero title field | Field cleared |
| 2 | Enter new title: "Test Title 123" | Title entered |
| 3 | Click "Simpan" | Saved indicator shown |
| 4 | Open landing page | New title visible |

---

### TC-033: Edit All Content Sections
**Story:** 6.3, 6.4, 6.5
**Priority:** Medium

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Edit hero subtitle | Saved |
| 2 | Edit CTA button text | Saved |
| 3 | Edit footer copyright | Saved |
| 4 | Verify all on landing | All changes reflected |

---

### TC-034: CMS Update Speed
**Story:** 6.6, 6.7
**Priority:** Critical

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Edit a content section | Save |
| 2 | Immediately open landing page | Update visible within 5 seconds |
| 3 | Stopwatch timing | < 5 seconds |

---

## Epic 7: Settings & Konfigurasi

### TC-035: Settings Page Load
**Story:** 7.1
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to "Pengaturan" | Settings page loads |
| 2 | Check WhatsApp section | Phone and template fields visible |
| 3 | Check Profile section | Email (readonly) and password fields |

---

### TC-036: Update WhatsApp Phone
**Story:** 7.2
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Change WhatsApp phone | New number entered |
| 2 | Save | Saved indicator shown |
| 3 | Test registration form | New number used in WhatsApp link |

---

### TC-037: Update Message Template
**Story:** 7.3
**Priority:** Medium

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Edit message template | Template updated |
| 2 | Save | Saved indicator shown |
| 3 | Test form submission | New template used in WhatsApp message |

---

### TC-038: Change Admin Password
**Story:** 7.6
**Priority:** High

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter new password | Password accepted |
| 2 | Confirm with different password | Error shown |
| 3 | Confirm correctly | Saved |
| 4 | Logout and login with new password | Login successful |

---

### TC-039: Danger Zone
**Story:** 7.8, 7.9
**Priority:** Low

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Scroll to bottom | Danger zone section visible |
| 2 | Click "Hapus Semua Data" | Confirmation required |
| 3 | Confirm deletion | Data deleted (use with caution) |

---

## NFR (Non-Functional Requirements) Test Cases

### NFR-01: Landing Page Performance
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Lighthouse or WebPageTest | Set to Moto G4, Fast 3G |
| 2 | Run performance test | LCP < 2 seconds |

### NFR-08: Accessibility
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open accessibility audit | Score > 85 |
| 2 | Check color contrast | Text on background > 4.5:1 |
| 3 | Check touch targets | All interactive elements > 44px |

### NFR-12: Security
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Try `/admin` without auth | Redirected to login |
| 2 | Try `/api/courses` without auth | Should work (public) |

---

## Summary

| Epic | Test Cases | Priority |
|------|-----------|----------|
| Epic 1 - Landing Page & Pendaftaran | TC-001 to TC-009 | 9 |
| Epic 2 - Admin Authentication | TC-010 to TC-014 | 5 |
| Epic 3 - Manajemen Kursus | TC-015 to TC-020 | 6 |
| Epic 4 - Manajemen Siswa | TC-021 to TC-025 | 5 |
| Epic 5 - Manajemen Jadwal | TC-026 to TC-030 | 5 |
| Epic 6 - Content Management | TC-031 to TC-034 | 4 |
| Epic 7 - Settings | TC-035 to TC-039 | 5 |
| NFR Tests | NFR-01, NFR-08, NFR-12 | 3 |
| **Total** | | **42** |

---

## Test Execution Log

| TC ID | Date | Tester | Result | Notes |
|-------|------|--------|--------|-------|
| TC-001 | 2026-05-08 | Anan | ⏳ Pending | |
| TC-002 | 2026-05-08 | Anan | ⏳ Pending | |
| TC-003 | 2026-05-08 | Anan | ⏳ Pending | |
| TC-004 | 2026-05-08 | Anan | ⏳ Pending | |
| TC-005 | 2026-05-08 | Anan | ⏳ Pending | |
| TC-006 | 2026-05-08 | Anan | ⏳ Pending | |
| TC-007 | 2026-05-08 | Anan | ⏳ Pending | |
| TC-008 | 2026-05-08 | Anan | ⏳ Pending | |
| TC-009 | 2026-05-08 | Anan | ⏳ Pending | |
| TC-010 | 2026-05-08 | Anan | ⏳ Pending | |

---

*Document created: 2026-05-08*
*Last updated: 2026-05-08*