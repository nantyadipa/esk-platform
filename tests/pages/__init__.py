"""
ESK Platform - Page Object Models
English Sepulang Kerja E2E Tests

CARA MENJALANKAN TEST:
- Semua test: python -m pytest tests/tests/ -v
- Epic 1: python -m pytest tests/tests/test_epic1_landing_registration.py -v
- Epic 2: python -m pytest tests/tests/test_epic2_admin_auth.py -v
- Epic 3: python -m pytest tests/tests/test_epic3_course_management.py -v
- Epic 4: python -m pytest tests/tests/test_epic4_student_management.py -v
- Epic 5: python -m pytest tests/tests/test_epic5_schedule_management.py -v
- Epic 6: python -m pytest tests/tests/test_epic6_content_management.py -v
- Epic 7: python -m pytest tests/tests/test_epic7_settings.py -v
- Smoke test: python -m pytest tests/tests/ -m smoke -v
- Regression: python -m pytest tests/tests/ -m regression -v

HTML Report akan otomatis tersimpan di: tests/reports/report.html
"""
from playwright.sync_api import Page, Locator, TimeoutError as PlaywrightTimeout


class LandingPage:
    """Landing page - Epic 1: Landing Page & Pendaftaran"""

    def __init__(self, page: Page):
        self.page = page
        self.base_url = "http://localhost:3000"

    def navigate(self) -> "LandingPage":
        self.page.goto(self.base_url)
        self.page.wait_for_load_state("networkidle")
        return self

    @property
    def hero_section(self) -> Locator:
        return self.page.locator('[data-testid="hero-section"]')

    @property
    def hero_cta_button(self) -> Locator:
        return self.page.locator('[data-testid="hero-cta"]')

    @property
    def nav_cta_button(self) -> Locator:
        return self.page.locator('[data-testid="nav-cta"]')

    @property
    def course_section(self) -> Locator:
        return self.page.locator('[data-testid="courses-section"]')

    @property
    def footer(self) -> Locator:
        return self.page.locator('[data-testid="footer"]')

    # Dynamic selectors: gunakan ^= untuk prefix matching
    def get_course_cards(self) -> Locator:
        """Get all course cards (dynamic IDs like course-card-{uuid})"""
        return self.page.locator('[data-testid^="course-card-"]')

    def get_course_card(self, course_name: str) -> Locator:
        """Find course card by text content (dynamic ID safe)"""
        # Cari semua course cards lalu filter yang mengandung nama kursus
        cards = self.get_course_cards()
        count = cards.count()
        for i in range(count):
            card = cards.nth(i)
            if card.locator('h4').text_content() == course_name:
                return card
        return self.page.locator('[data-testid^="course-card-"]').first

    def get_course_price(self, course_name: str = None) -> str:
        """Get course price text (dynamic ID safe)"""
        if course_name:
            card = self.get_course_card(course_name)
        else:
            card = self.get_course_cards().first
        price_container = card.locator('[data-testid^="price-display-"]')
        return price_container.text_content() or ""

    def get_course_discount_badge(self, course_name: str = None) -> Locator:
        """Get discount badge (dynamic ID safe)"""
        if course_name:
            card = self.get_course_card(course_name)
        else:
            card = self.get_course_cards().first
        return card.locator('[data-testid^="discount-badge-"]')

    def click_course_register_button(self, course_name: str = None) -> "LandingPage":
        """Click register button on course card (dynamic ID safe)"""
        if course_name:
            card = self.get_course_card(course_name)
        else:
            card = self.get_course_cards().first
        card.locator('[data-testid^="course-cta-"]').click()
        return self

    def click_open_registration_form(self) -> "LandingPage":
        self.page.locator('[data-testid="open-registration-form"]').click()
        return self


class RegistrationForm:
    """Registration form - Epic 1"""

    def __init__(self, page: Page):
        self.page = page
        self.form = self.page.locator('[data-testid="registration-form"]')

    @property
    def name_field(self) -> Locator:
        return self.form.locator('[data-testid="reg-name"]')

    @property
    def phone_field(self) -> Locator:
        return self.form.locator('[data-testid="reg-phone"]')

    @property
    def class_field(self) -> Locator:
        return self.form.locator('[data-testid="reg-class"]')

    @property
    def mode_online(self) -> Locator:
        return self.form.locator('[data-testid="reg-mode-online"]')

    @property
    def mode_offline(self) -> Locator:
        return self.form.locator('[data-testid="reg-mode-offline"]')

    @property
    def referral_code_field(self) -> Locator:
        return self.form.locator('[data-testid="reg-referral"]')

    @property
    def error_display(self) -> Locator:
        return self.form.locator('[data-testid="registration-error"]')

    @property
    def submit_button(self) -> Locator:
        return self.form.locator('[data-testid="registration-submit"]')

    @property
    def whatsapp_link(self) -> Locator:
        return self.form.locator('[data-testid="whatsapp-link"]')

    @property
    def close_button(self) -> Locator:
        return self.page.locator('[data-testid="registration-form-close"]')

    def fill_name(self, name: str) -> "RegistrationForm":
        self.name_field.fill(name)
        return self

    def fill_phone(self, phone: str) -> "RegistrationForm":
        self.phone_field.fill(phone)
        return self

    def select_mode(self, mode: str) -> "RegistrationForm":
        if mode.lower() == "online":
            self.mode_online.click()
        else:
            self.mode_offline.click()
        return self

    def fill_referral(self, code: str) -> "RegistrationForm":
        self.referral_code_field.fill(code)
        return self

    def submit(self) -> None:
        self.submit_button.click()

    def close(self) -> None:
        self.close_button.click()


class AdminLoginPage:
    """Admin login - Epic 2"""

    def __init__(self, page: Page):
        self.page = page
        self.base_url = "http://localhost:3000/admin/login"

    def navigate(self) -> "AdminLoginPage":
        self.page.goto(self.base_url)
        self.page.wait_for_load_state("networkidle")
        return self

    @property
    def email_field(self) -> Locator:
        return self.page.locator('[data-testid="login-email"]')

    @property
    def password_field(self) -> Locator:
        return self.page.locator('[data-testid="login-password"]')

    @property
    def submit_button(self) -> Locator:
        return self.page.locator('[data-testid="login-submit"]')

    @property
    def error_message(self) -> Locator:
        return self.page.locator('[data-testid="login-error"]')

    def login(self, email: str, password: str) -> "AdminLoginPage":
        self.email_field.fill(email)
        self.password_field.fill(password)
        self.submit_button.click()
        self.page.wait_for_load_state("networkidle")
        return self


class AdminDashboard:
    """Admin dashboard overview - Epic 2"""

    def __init__(self, page: Page):
        self.page = page
        self.base_url = "http://localhost:3000/admin"

    def navigate(self) -> "AdminDashboard":
        self.page.goto(self.base_url)
        self.page.wait_for_load_state("networkidle")
        return self

    @property
    def sidebar(self) -> Locator:
        return self.page.locator('[data-testid="admin-sidebar"]')

    @property
    def nav_courses(self) -> Locator:
        return self.page.locator('[data-testid="admin-nav-courses"]')

    @property
    def nav_students(self) -> Locator:
        return self.page.locator('[data-testid="admin-nav-students"]')

    @property
    def nav_schedules(self) -> Locator:
        return self.page.locator('[data-testid="admin-nav-schedules"]')

    @property
    def nav_content(self) -> Locator:
        return self.page.locator('[data-testid="admin-nav-content"]')

    @property
    def nav_settings(self) -> Locator:
        return self.page.locator('[data-testid="admin-nav-settings"]')

    @property
    def logout_button(self) -> Locator:
        return self.page.locator('[data-testid="admin-btn-logout"]')

    def navigate_to_courses(self) -> "CourseManagement":
        self.nav_courses.click()
        self.page.wait_for_load_state("networkidle")
        return CourseManagement(self.page)

    def navigate_to_students(self) -> "StudentManagement":
        self.nav_students.click()
        self.page.wait_for_load_state("networkidle")
        return StudentManagement(self.page)

    def navigate_to_schedules(self) -> "ScheduleManagement":
        self.nav_schedules.click()
        self.page.wait_for_load_state("networkidle")
        return ScheduleManagement(self.page)

    def navigate_to_content(self) -> "ContentManagement":
        self.nav_content.click()
        self.page.wait_for_load_state("networkidle")
        return ContentManagement(self.page)

    def navigate_to_settings(self) -> "SettingsPage":
        self.nav_settings.click()
        self.page.wait_for_load_state("networkidle")
        return SettingsPage(self.page)

    def logout(self) -> None:
        self.logout_button.click()
        self.page.wait_for_url("**/admin/login**", timeout=10000)


class CourseManagement:
    """Course management - Epic 3"""

    def __init__(self, page: Page):
        self.page = page

    @property
    def add_course_button(self) -> Locator:
        return self.page.locator('[data-testid="btn-add-course"]')

    @property
    def course_table(self) -> Locator:
        return self.page.locator('[data-testid="admin-courses"]')

    @property
    def course_rows(self) -> Locator:
        # Dynamic: each row has data-course-id attribute
        return self.page.locator('[data-course-id]')

    @property
    def modal(self) -> Locator:
        # Modal doesn't have data-testid, detect by presence of close button in overlay
        return self.page.locator('.fixed.inset-0.z-50').first

    @property
    def name_input(self) -> Locator:
        return self.page.locator('[data-testid="input-name"]').first

    @property
    def description_input(self) -> Locator:
        return self.page.locator('[data-testid="input-description"]').first

    @property
    def base_price_input(self) -> Locator:
        return self.page.locator('[data-testid="input-base-price"]').first

    @property
    def discount_rate_input(self) -> Locator:
        return self.page.locator('[data-testid="input-discount-rate"]').first

    @property
    def sessions_input(self) -> Locator:
        return self.page.locator('[data-testid="input-sessions"]').first

    @property
    def mode_select(self) -> Locator:
        return self.page.locator('[data-testid="input-mode"]').first

    @property
    def is_active_toggle(self) -> Locator:
        return self.page.locator('[data-testid="input-is-active"]').first

    @property
    def submit_button(self) -> Locator:
        return self.page.locator('[data-testid="btn-submit"]').first

    @property
    def cancel_button(self) -> Locator:
        return self.page.locator('[data-testid="btn-cancel"]').first

    @property
    def close_button(self) -> Locator:
        return self.page.locator('[data-testid="btn-close-modal"]').first

    @property
    def delete_confirm_dialog(self) -> Locator:
        return self.page.locator('[data-testid="delete-confirm-dialog"]')

    @property
    def confirm_delete_button(self) -> Locator:
        return self.page.locator('[data-testid="btn-confirm-delete"]')

    def click_add_course(self) -> "CourseManagement":
        self.add_course_button.click()
        self.page.wait_for_selector('[data-testid="input-name"]', timeout=5000)
        return self

    def edit_course(self, course_id: str) -> "CourseManagement":
        # Dynamic: btn-edit-{course_id}
        self.page.locator(f'[data-testid="btn-edit-{course_id}"]').click()
        self.page.wait_for_selector('[data-testid="input-name"]', timeout=5000)
        return self

    def delete_course(self, course_id: str) -> "CourseManagement":
        self.page.locator(f'[data-testid="btn-delete-{course_id}"]').click()
        self.page.wait_for_selector('[data-testid="btn-confirm-delete"]', timeout=5000)
        self.confirm_delete_button.click()
        self.page.wait_for_selector('[data-testid="btn-confirm-delete"]', state="hidden", timeout=5000)
        return self

    def fill_course_form(self, name: str = "", description: str = "",
                         base_price: str = "", discount_rate: str = "0",
                         sessions: str = "", mode: str = "both") -> "CourseManagement":
        if name:
            self.name_input.fill(name)
        if description:
            self.description_input.fill(description)
        if base_price:
            self.base_price_input.fill(base_price)
        if discount_rate:
            self.discount_rate_input.fill(discount_rate)
        if sessions:
            self.sessions_input.fill(sessions)
        if mode:
            self.mode_select.select_option(mode)
        return self

    def submit_form(self) -> "CourseManagement":
        self.submit_button.click()
        # Modal closes with page reload, so wait for load state
        self.page.wait_for_load_state("networkidle", timeout=10000)
        return self

    def close_modal(self) -> "CourseManagement":
        self.close_button.click()
        self.page.wait_for_selector('[data-testid="input-name"]', state="hidden", timeout=5000)
        return self


class StudentManagement:
    """Student management - Epic 4"""

    def __init__(self, page: Page):
        self.page = page

    @property
    def add_student_button(self) -> Locator:
        return self.page.locator('[data-testid="btn-add-student"]')

    @property
    def student_table(self) -> Locator:
        return self.page.locator('[data-testid="admin-students"]')

    @property
    def student_rows(self) -> Locator:
        return self.page.locator('[data-student-id]')

    @property
    def search_field(self) -> Locator:
        # Search input uses placeholder instead of data-testid
        return self.page.locator('input[placeholder*="Cari"]')

    @property
    def filter_course(self) -> Locator:
        # Filter select - first select in filter area
        return self.page.locator('select').nth(0)

    @property
    def filter_status(self) -> Locator:
        # Status filter - second select in filter area
        return self.page.locator('select').nth(1)

    @property
    def modal(self) -> Locator:
        # Modal detected by overlay presence
        return self.page.locator('.fixed.inset-0.z-50').first

    @property
    def name_input(self) -> Locator:
        return self.page.locator('[data-testid="input-name"]').first

    @property
    def phone_input(self) -> Locator:
        return self.page.locator('[data-testid="input-phone"]').first

    @property
    def course_select(self) -> Locator:
        return self.page.locator('[data-testid="input-course"]').first

    @property
    def mode_select(self) -> Locator:
        return self.page.locator('[data-testid="input-mode"]').first

    @property
    def status_select(self) -> Locator:
        return self.page.locator('[data-testid="input-status"]').first

    @property
    def referral_input(self) -> Locator:
        return self.page.locator('[data-testid="input-referral"]').first

    @property
    def notes_input(self) -> Locator:
        return self.page.locator('[data-testid="input-notes"]').first

    @property
    def submit_button(self) -> Locator:
        return self.page.locator('[data-testid="btn-submit"]').first

    @property
    def close_button(self) -> Locator:
        return self.page.locator('[data-testid="btn-close-modal"]').first

    def click_add_student(self) -> "StudentManagement":
        self.add_student_button.click()
        self.page.wait_for_selector('[data-testid="input-name"]', timeout=5000)
        return self

    def edit_student(self, student_id: str) -> "StudentManagement":
        self.page.locator(f'[data-testid="btn-edit-{student_id}"]').click()
        self.page.wait_for_selector('[data-testid="input-name"]', timeout=5000)
        return self

    def delete_student(self, student_id: str) -> "StudentManagement":
        self.page.locator(f'[data-testid="btn-delete-{student_id}"]').click()
        self.page.wait_for_selector('[data-testid="btn-confirm-delete"]', timeout=5000)
        self.page.locator('[data-testid="btn-confirm-delete"]').click()
        self.page.wait_for_selector('[data-testid="btn-confirm-delete"]', state="hidden", timeout=5000)
        return self

    def search_students(self, query: str) -> "StudentManagement":
        self.search_field.fill(query)
        self.page.wait_for_timeout(500)
        return self

    def filter_by_course(self, course_id: str) -> "StudentManagement":
        self.filter_course.select_option(course_id)
        self.page.wait_for_timeout(500)
        return self

    def filter_by_status(self, status: str) -> "StudentManagement":
        self.filter_status.select_option(status)
        self.page.wait_for_timeout(500)
        return self

    def fill_student_form(self, name: str = "", phone: str = "",
                          course_id: str = "", mode: str = "online",
                          status: str = "aktif", referral: str = "",
                          notes: str = "") -> "StudentManagement":
        if name:
            self.name_input.fill(name)
        if phone:
            self.phone_input.fill(phone)
        if course_id:
            self.course_select.select_option(course_id)
        if mode:
            self.mode_select.select_option(mode)
        if status:
            self.status_select.select_option(status)
        if referral:
            self.referral_input.fill(referral)
        if notes:
            self.notes_input.fill(notes)
        return self

    def submit_form(self) -> "StudentManagement":
        self.submit_button.click()
        # Wait a moment for validation or submission
        self.page.wait_for_timeout(2000)
        # Check if error is shown
        error = self.page.locator('[data-testid="submit-error"]')
        if error.is_visible():
            error_text = error.text_content()
            raise AssertionError(f"Form submission failed: {error_text}")
        # Modal closes with page reload, so wait for load state
        try:
            self.page.wait_for_load_state("networkidle", timeout=10000)
        except:
            pass
        return self

    def close_modal(self) -> "StudentManagement":
        self.close_button.click()
        self.page.wait_for_selector('[data-testid="input-name"]', state="hidden", timeout=5000)
        return self


class ScheduleManagement:
    """Schedule management with calendar - Epic 5"""

    def __init__(self, page: Page):
        self.page = page

    @property
    def add_schedule_button(self) -> Locator:
        # Button might not have data-testid, use text content as fallback
        return self.page.locator('button:has-text("Tambah Jadwal")')

    @property
    def filter_course(self) -> Locator:
        return self.page.locator('[data-testid="filter-course"]')

    @property
    def calendar(self) -> Locator:
        return self.page.locator('[data-testid="calendar-view"]')

    @property
    def calendar_events(self) -> Locator:
        # FullCalendar events - dynamic IDs
        return self.page.locator('.fc-event')

    @property
    def modal(self) -> Locator:
        return self.page.locator('[data-testid="schedule-modal"]').first

    @property
    def course_select(self) -> Locator:
        return self.page.locator('[data-testid="input-course"]').first

    @property
    def meeting_number_input(self) -> Locator:
        return self.page.locator('[data-testid="input-meeting-number"]').first

    @property
    def date_input(self) -> Locator:
        return self.page.locator('[data-testid="input-date"]').first

    @property
    def start_time_input(self) -> Locator:
        return self.page.locator('[data-testid="input-start-time"]').first

    @property
    def end_time_input(self) -> Locator:
        return self.page.locator('[data-testid="input-end-time"]').first

    @property
    def zoom_link_input(self) -> Locator:
        return self.page.locator('[data-testid="input-zoom-link"]').first

    @property
    def mode_select(self) -> Locator:
        return self.page.locator('[data-testid="input-mode"]').first

    @property
    def student_checkboxes(self) -> Locator:
        return self.page.locator('[data-testid^="student-checkbox-"]')

    @property
    def submit_button(self) -> Locator:
        return self.page.locator('[data-testid="btn-submit"]').first

    @property
    def close_button(self) -> Locator:
        return self.page.locator('[data-testid="btn-close-modal"]').first

    @property
    def delete_button(self) -> Locator:
        return self.page.locator('[data-testid="btn-delete-schedule"]').first

    def click_add_schedule(self) -> "ScheduleManagement":
        self.add_schedule_button.click()
        self.page.wait_for_selector('[data-testid="schedule-modal"]', timeout=5000)
        return self

    def click_calendar_event(self, event_id: str) -> "ScheduleManagement":
        # FullCalendar events
        self.page.locator(f'[data-event-id="{event_id}"]').click()
        self.page.wait_for_selector('[data-testid="schedule-modal"]', timeout=5000)
        return self

    def click_calendar_date(self, date: str) -> "ScheduleManagement":
        self.page.locator(f'[data-date="{date}"]').click()
        self.page.wait_for_selector('[data-testid="schedule-modal"]', timeout=5000)
        return self

    def filter_by_course(self, course_id: str) -> "ScheduleManagement":
        self.filter_course.select_option(course_id)
        self.page.wait_for_timeout(500)
        return self

    def fill_schedule_form(self, course_id: str = "", meeting_number: str = "",
                           date: str = "", start_time: str = "",
                           end_time: str = "", zoom_link: str = "",
                           mode: str = "online") -> "ScheduleManagement":
        if course_id:
            self.course_select.select_option(course_id)
        if meeting_number:
            self.meeting_number_input.fill(meeting_number)
        if date:
            self.date_input.fill(date)
        if start_time:
            self.start_time_input.fill(start_time)
        if end_time:
            self.end_time_input.fill(end_time)
        if zoom_link:
            self.zoom_link_input.fill(zoom_link)
        if mode:
            self.mode_select.select_option(mode)
        return self

    def select_student(self, student_id: str) -> "ScheduleManagement":
        self.page.locator(f'[data-testid="student-checkbox-{student_id}"]').check()
        return self

    def submit_form(self) -> "ScheduleManagement":
        self.submit_button.click()
        self.page.wait_for_selector('[data-testid="schedule-modal"]', state="hidden", timeout=10000)
        return self

    def delete_schedule(self) -> "ScheduleManagement":
        self.delete_button.click()
        self.page.wait_for_selector('[data-testid="delete-confirm"]')
        self.page.locator('[data-testid="btn-confirm-delete"]').click()
        self.page.wait_for_selector('[data-testid="schedule-modal"]', state="hidden")
        return self


class ContentManagement:
    """Content management CMS - Epic 6"""

    def __init__(self, page: Page):
        self.page = page

    @property
    def content_sections(self) -> Locator:
        return self.page.locator('[data-testid="content-section"]')

    @property
    def hero_title_field(self) -> Locator:
        return self.page.locator('[data-testid="input-hero-title"]')

    @property
    def hero_subtitle_field(self) -> Locator:
        return self.page.locator('[data-testid="input-hero-subtitle"]')

    @property
    def hero_cta_text_field(self) -> Locator:
        return self.page.locator('[data-testid="input-hero-cta-text"]')

    @property
    def footer_copyright_field(self) -> Locator:
        return self.page.locator('[data-testid="input-footer-copyright"]')

    @property
    def save_buttons(self) -> Locator:
        return self.page.locator('[data-testid^="btn-save-"]')

    @property
    def saved_indicator(self) -> Locator:
        return self.page.locator('[data-testid="saved-indicator"]')

    def edit_hero_title(self, value: str) -> "ContentManagement":
        self.hero_title_field.clear()
        self.hero_title_field.fill(value)
        return self

    def edit_hero_subtitle(self, value: str) -> "ContentManagement":
        self.hero_subtitle_field.clear()
        self.hero_subtitle_field.fill(value)
        return self

    def edit_hero_cta_text(self, value: str) -> "ContentManagement":
        self.hero_cta_text_field.clear()
        self.hero_cta_text_field.fill(value)
        return self

    def edit_footer_copyright(self, value: str) -> "ContentManagement":
        self.footer_copyright_field.clear()
        self.footer_copyright_field.fill(value)
        return self

    def save_section(self, section_key: str) -> "ContentManagement":
        self.page.locator(f'[data-testid="btn-save-{section_key}"]').click()
        self.page.wait_for_selector('[data-testid="saved-indicator"]', timeout=5000)
        return self


class SettingsPage:
    """Settings page - Epic 7"""

    def __init__(self, page: Page):
        self.page = page

    @property
    def whatsapp_config_section(self) -> Locator:
        return self.page.locator('[data-testid="whatsapp-config"]')

    @property
    def admin_phone_input(self) -> Locator:
        return self.whatsapp_config_section.locator('[data-testid="input-admin-phone"]')

    @property
    def message_template_input(self) -> Locator:
        return self.whatsapp_config_section.locator('[data-testid="input-message-template"]')

    @property
    def save_whatsapp_button(self) -> Locator:
        return self.whatsapp_config_section.locator('[data-testid="btn-save-whatsapp"]')

    @property
    def profile_section(self) -> Locator:
        return self.page.locator('[data-testid="admin-profile"]')

    @property
    def email_input(self) -> Locator:
        return self.profile_section.locator('[data-testid="input-email"]')

    @property
    def new_password_input(self) -> Locator:
        return self.profile_section.locator('[data-testid="input-new-password"]')

    @property
    def confirm_password_input(self) -> Locator:
        return self.profile_section.locator('[data-testid="input-confirm-password"]')

    @property
    def save_profile_button(self) -> Locator:
        return self.profile_section.locator('[data-testid="btn-save-profile"]')

    @property
    def danger_zone(self) -> Locator:
        return self.page.locator('[data-testid="danger-zone"]')

    @property
    def delete_all_data_button(self) -> Locator:
        return self.danger_zone.locator('[data-testid="btn-delete-all-data"]')

    @property
    def saved_indicator(self) -> Locator:
        return self.page.locator('[data-testid="saved-indicator"]')

    def update_whatsapp_phone(self, phone: str) -> "SettingsPage":
        self.admin_phone_input.clear()
        self.admin_phone_input.fill(phone)
        return self

    def update_message_template(self, template: str) -> "SettingsPage":
        self.message_template_input.clear()
        self.message_template_input.fill(template)
        return self

    def save_whatsapp_config(self) -> "SettingsPage":
        self.save_whatsapp_button.click()
        self.page.wait_for_selector('[data-testid="saved-indicator"]', timeout=5000)
        return self

    def change_password(self, new_password: str, confirm_password: str) -> "SettingsPage":
        self.new_password_input.fill(new_password)
        self.confirm_password_input.fill(confirm_password)
        self.save_profile_button.click()
        self.page.wait_for_selector('[data-testid="saved-indicator"]', timeout=5000)
        return self
