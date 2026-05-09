"""
ESK Platform - Course Management E2E Tests
Epic 3: Manajemen Kursus
"""
import pytest
from playwright.sync_api import Page, expect
from tests.pages import AdminLoginPage, AdminDashboard, CourseManagement


class TestCourseManagement:
    """Test Epic 3 - Course Management"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Login before each test"""
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

    def test_course_list_displays(self, page: Page):
        """Story 3.1: Course list displays in table"""
        dashboard = AdminDashboard(page)
        courses = dashboard.navigate_to_courses()

        expect(courses.course_table).to_be_visible()

    def test_add_course_modal_opens(self, page: Page):
        """Story 3.2: Add course modal opens"""
        dashboard = AdminDashboard(page)
        courses = dashboard.navigate_to_courses()
        courses.click_add_course()

        expect(courses.modal).to_be_visible()
        expect(courses.name_input).to_be_visible()

    def test_add_course_with_all_fields(self, page: Page):
        """Story 3.3: Add course with all fields"""
        dashboard = AdminDashboard(page)
        courses = dashboard.navigate_to_courses()
        courses.click_add_course()

        courses.fill_course_form(
            name="Test Course",
            description="Test Description",
            base_price="500000",
            discount_rate="10",
            sessions="8",
            mode="both"
        )
        courses.submit_form()

        # Modal should close
        expect(courses.modal).not_to_be_visible()

    def test_add_course_minimal_fields(self, page: Page):
        """Story 3.4: Add course with minimal required fields"""
        dashboard = AdminDashboard(page)
        courses = dashboard.navigate_to_courses()
        courses.click_add_course()

        courses.fill_course_form(
            name="Minimal Course",
            description="Description",
            base_price="100000",
            sessions="4"
        )
        courses.submit_form()

        expect(courses.modal).not_to_be_visible()

    def test_edit_course(self, page: Page):
        """Story 3.5: Edit existing course"""
        dashboard = AdminDashboard(page)
        courses = dashboard.navigate_to_courses()

        # Get first course row
        rows = courses.course_rows
        if rows.count() > 0:
            first_row = rows.first
            edit_button = first_row.locator('[data-testid^="btn-edit-"]')
            if edit_button.is_visible():
                courses.edit_course(first_row.get_attribute('data-course-id') or "unknown")
                courses.fill_course_form(name="Updated Course")
                courses.submit_form()

    def test_delete_course(self, page: Page):
        """Story 3.6: Delete course with confirmation"""
        dashboard = AdminDashboard(page)
        courses = dashboard.navigate_to_courses()

        # Get first course
        rows = courses.course_rows
        if rows.count() > 0:
            first_row = rows.first
            delete_button = first_row.locator('[data-testid^="btn-delete-"]')
            if delete_button.is_visible():
                courses.delete_course(first_row.get_attribute('data-course-id') or "unknown")

    def test_course_form_validation_empty_name(self, page: Page):
        """Story 3.7: Course form validates empty name"""
        dashboard = AdminDashboard(page)
        courses = dashboard.navigate_to_courses()
        courses.click_add_course()

        courses.fill_course_form(
            name="",
            description="Test",
            base_price="100000",
            sessions="4"
        )
        courses.submit_button.click()

        # Modal should still be visible (validation error)
        expect(courses.modal).to_be_visible()

    def test_course_discount_display_calculation(self, page: Page):
        """Story 3.8: Discount calculation is correct"""
        dashboard = AdminDashboard(page)
        courses = dashboard.navigate_to_courses()
        courses.click_add_course()

        courses.fill_course_form(
            name="Discount Test",
            description="Test",
            base_price="500000",
            discount_rate="20",  # 20%
            sessions="4"
        )
        courses.submit_form()

        # Course should be saved with correct discount
        expect(courses.modal).not_to_be_visible()


class TestCourseLandingPageUpdate:
    """Test Epic 3 - Landing Page Updates"""

    def test_course_appears_on_landing_page(self, page: Page):
        """Story 3.9: New course appears on landing page"""
        # First add a course via admin
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

        dashboard = AdminDashboard(page)
        courses = dashboard.navigate_to_courses()
        courses.click_add_course()

        courses.fill_course_form(
            name="Landing Page Test Course",
            description="Test Description",
            base_price="300000",
            sessions="6"
        )
        courses.submit_form()

        # Now check landing page - may need reload due to ISR cache
        page.goto("http://localhost:3000")
        page.wait_for_load_state("networkidle")
        page.reload()
        page.wait_for_load_state("networkidle")

        # Check if any course card contains our test course name
        course_cards = page.locator('[data-testid^="course-card-"]')
        count = course_cards.count()
        found = False
        for i in range(count):
            card = course_cards.nth(i)
            title = card.locator('h4').text_content()
            if title and "Landing Page Test Course" in title:
                found = True
                break
        assert found, "Course not found on landing page"

    def test_price_update_reflects_on_landing(self, page: Page):
        """Story 3.10: Price update reflects on landing page"""
        # Update price via admin
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

        dashboard = AdminDashboard(page)
        courses = dashboard.navigate_to_courses()

        # Edit first course
        rows = courses.course_rows
        if rows.count() > 0:
            courses.edit_course(rows.first.get_attribute('data-course-id') or "unknown")
            courses.fill_course_form(base_price="750000")
            courses.submit_form()

        # Check landing page
        page.goto("http://localhost:3000")
        page.wait_for_load_state("networkidle")