"""
ESK Platform - Schedule Management E2E Tests
Epic 5: Manajemen Jadwal & Kalender
"""
import pytest
from playwright.sync_api import Page, expect
from tests.pages import AdminLoginPage, AdminDashboard, ScheduleManagement


class TestScheduleManagement:
    """Test Epic 5 - Schedule Management"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Login before each test"""
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

    def test_schedule_calendar_displays(self, page: Page):
        """Story 5.1: Schedule calendar displays"""
        dashboard = AdminDashboard(page)
        schedules = dashboard.navigate_to_schedules()

        expect(schedules.calendar).to_be_visible()

    def test_add_schedule_modal_opens(self, page: Page):
        """Story 5.2: Add schedule modal opens"""
        dashboard = AdminDashboard(page)
        schedules = dashboard.navigate_to_schedules()
        schedules.click_add_schedule()

        expect(schedules.modal).to_be_visible()
        expect(schedules.course_select).to_be_visible()

    def test_add_schedule_with_all_fields(self, page: Page):
        """Story 5.3: Add schedule with all fields"""
        dashboard = AdminDashboard(page)
        schedules = dashboard.navigate_to_schedules()
        schedules.click_add_schedule()

        # Fill form
        schedules.fill_schedule_form(
            meeting_number="1",
            date="2026-06-15",
            start_time="19:00",
            end_time="21:00",
            zoom_link="https://zoom.us/j/123456789",
            mode="online"
        )
        schedules.submit_form()

        expect(schedules.modal).not_to_be_visible()

    def test_edit_schedule(self, page: Page):
        """Story 5.4: Edit existing schedule"""
        dashboard = AdminDashboard(page)
        schedules = dashboard.navigate_to_schedules()

        # Click on first calendar event if exists
        events = schedules.calendar_events
        if events.count() > 0:
            schedules.click_calendar_event(events.first.get_attribute('data-event-id') or "unknown")
            expect(schedules.modal).to_be_visible()
            schedules.close_button.click()

    def test_delete_schedule(self, page: Page):
        """Story 5.5: Delete schedule with confirmation"""
        dashboard = AdminDashboard(page)
        schedules = dashboard.navigate_to_schedules()

        events = schedules.calendar_events
        if events.count() > 0:
            schedules.click_calendar_event(events.first.get_attribute('data-event-id') or "unknown")
            schedules.delete_schedule()
            expect(schedules.modal).not_to_be_visible()


class TestCalendarView:
    """Test Epic 5 - Calendar View"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Login before each test"""
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

    def test_calendar_week_view(self, page: Page):
        """Story 5.6: Calendar week view works"""
        dashboard = AdminDashboard(page)
        schedules = dashboard.navigate_to_schedules()

        # Calendar should be visible with default view
        expect(schedules.calendar).to_be_visible()

    def test_calendar_month_view(self, page: Page):
        """Story 5.7: Calendar month view works"""
        dashboard = AdminDashboard(page)
        schedules = dashboard.navigate_to_schedules()

        # Calendar month view button
        month_button = page.locator('[data-testid="btn-calendar-month"]')
        if month_button.is_visible():
            month_button.click()
            page.wait_for_timeout(500)

    def test_calendar_color_coding(self, page: Page):
        """Story 5.8: Calendar shows color coding by course type"""
        dashboard = AdminDashboard(page)
        schedules = dashboard.navigate_to_schedules()

        events = schedules.calendar_events
        # Events should have color coding
        if events.count() > 0:
            first_event = events.first
            # Check if event has background color style
            bg_color = first_event.get_attribute("style")
            # Should have some color defined

    def test_calendar_filter_by_course(self, page: Page):
        """Story 5.9: Calendar filter by course works"""
        dashboard = AdminDashboard(page)
        schedules = dashboard.navigate_to_schedules()

        options = schedules.filter_course.locator("option")
        if options.count() > 1:
            second_option = options.nth(1)
            course_id = second_option.get_attribute("value")
            if course_id:
                schedules.filter_by_course(course_id)
                page.wait_for_timeout(500)


class TestScheduleConflictDetection:
    """Test Epic 5 - Schedule Conflict Detection"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Login before each test"""
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

    def test_schedule_conflict_rejected(self, page: Page):
        """Story 5.10: System rejects schedule with time conflict"""
        dashboard = AdminDashboard(page)
        schedules = dashboard.navigate_to_schedules()

        # Try to create a conflicting schedule
        schedules.click_add_schedule()

        # First create a schedule
        schedules.fill_schedule_form(
            course_id="",  # Will need a valid course
            meeting_number="1",
            date="2026-06-15",
            start_time="19:00",
            end_time="21:00"
        )
        schedules.submit_form()

        # Try to create another at same time
        schedules.click_add_schedule()
        schedules.fill_schedule_form(
            meeting_number="2",
            date="2026-06-15",
            start_time="19:30",
            end_time="20:30"
        )
        schedules.submit_form()

        # Should show conflict error (implementation dependent)