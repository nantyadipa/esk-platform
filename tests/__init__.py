"""
ESK Platform - Test Automation
English Sepulang Kerja E2E Tests

CARA MENJALANKAN TEST AUTOMATION:
==================================

1. Semua Test:
   python -m pytest tests/tests/ -v

2. Per Epic:
   python -m pytest tests/tests/test_epic1_landing_registration.py -v
   python -m pytest tests/tests/test_epic2_admin_auth.py -v
   python -m pytest tests/tests/test_epic3_course_management.py -v
   python -m pytest tests/tests/test_epic4_student_management.py -v
   python -m pytest tests/tests/test_epic5_schedule_management.py -v
   python -m pytest tests/tests/test_epic6_content_management.py -v
   python -m pytest tests/tests/test_epic7_settings.py -v

3. Dengan HTML Report:
   python -m pytest tests/tests/ -v --html=tests/reports/report.html

4. Smoke Tests Only:
   python -m pytest tests/tests/ -m smoke -v

5. Regression Tests Only:
   python -m pytest tests/tests/ -m regression -v

HASIL REPORT:
=============
- HTML Report: tests/reports/report.html
- Screenshots (jika gagal): tests/reports/screenshots/
- Console Logs: tests/reports/logs/

STRUKTUR SELECTOR:
==================
Test menggunakan dua pendekatan selector:
1. Exact match: [data-testid="nama-selector"]
2. Prefix match (untuk ID dinamis): [data-testid^="prefix-"]
   Contoh: course-card-{uuid} => [data-testid^="course-card-"]

Ketergantungan:
- pytest-playwright
- pytest-html
"""

__version__ = "1.0.0"
__author__ = "ESK Development Team"
