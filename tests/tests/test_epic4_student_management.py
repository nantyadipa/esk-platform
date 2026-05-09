"""
ESK Platform - Student Management E2E Tests
Epic 4: Manajemen Siswa
"""
import pytest
from playwright.sync_api import Page, expect
from tests.pages import AdminLoginPage, AdminDashboard, StudentManagement


class TestStudentManagement:
    """Test Epic 4 - Student Management"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Login before each test"""
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

    def test_student_list_displays(self, page: Page):
        """Story 4.1: Student list displays in table"""
        dashboard = AdminDashboard(page)
        students = dashboard.navigate_to_students()

        expect(students.student_table).to_be_visible()

    def test_add_student_modal_opens(self, page: Page):
        """Story 4.2: Add student modal opens"""
        dashboard = AdminDashboard(page)
        students = dashboard.navigate_to_students()
        students.click_add_student()

        expect(students.modal).to_be_visible()
        expect(students.name_input).to_be_visible()

    def test_add_student_with_all_fields(self, page: Page):
        """Story 4.3: Add student with all fields"""
        dashboard = AdminDashboard(page)
        students = dashboard.navigate_to_students()
        students.click_add_student()

        # Wait for modal to fully load
        page.wait_for_timeout(1000)

        # Get first available course option if any
        course_options = students.course_select.locator('option')
        if course_options.count() <= 1:
            pytest.skip("No courses available to assign to student")

        # Select by index
        students.course_select.select_option(index=1)

        students.fill_student_form(
            name="John Doe",
            phone="6281234567890",
            mode="online",
            status="aktif",
            referral="REF001",
            notes="Test notes"
        )
        students.submit_form()

        # After page reload, modal should be gone
        assert not students.modal.is_visible(), "Modal still visible after submit"

    def test_add_student_minimal_fields(self, page: Page):
        """Story 4.4: Add student with minimal required fields"""
        dashboard = AdminDashboard(page)
        students = dashboard.navigate_to_students()
        students.click_add_student()

        # Wait for modal to fully load
        page.wait_for_timeout(1000)

        # Get first available course option if any
        course_options = students.course_select.locator('option')
        if course_options.count() <= 1:
            pytest.skip("No courses available to assign to student")

        # Select by index (same as all_fields test)
        students.course_select.select_option(index=1)

        students.fill_student_form(
            name="Jane Doe",
            phone="6289876543210",
            course_id="",  # Don't override course selection
            mode="online",
            status="aktif"
        )
        students.submit_form()

        # After page reload, modal should be gone
        assert not students.modal.is_visible(), "Modal still visible after submit"

    def test_edit_student(self, page: Page):
        """Story 4.5: Edit existing student"""
        dashboard = AdminDashboard(page)
        students = dashboard.navigate_to_students()

        rows = students.student_rows
        if rows.count() > 0:
            first_row = rows.first
            edit_button = first_row.locator('[data-testid^="btn-edit-"]')
            if edit_button.is_visible():
                students.edit_student(first_row.get_attribute('data-student-id') or "unknown")
                students.fill_student_form(name="Updated Name")
                students.submit_form()

    def test_delete_student(self, page: Page):
        """Story 4.6: Delete student with confirmation"""
        dashboard = AdminDashboard(page)
        students = dashboard.navigate_to_students()

        rows = students.student_rows
        if rows.count() > 0:
            first_row = rows.first
            delete_button = first_row.locator('[data-testid^="btn-delete-"]')
            if delete_button.is_visible():
                students.delete_student(first_row.get_attribute('data-student-id') or "unknown")


class TestStudentSearchFilter:
    """Test Epic 4 - Student Search & Filter"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Login before each test"""
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

    def test_search_students_by_name(self, page: Page):
        """Story 4.7: Search students by name"""
        dashboard = AdminDashboard(page)
        students = dashboard.navigate_to_students()

        # Type in search field
        students.search_students("John")

        # Wait for results
        page.wait_for_timeout(1000)

    def test_filter_students_by_status(self, page: Page):
        """Story 4.8: Filter students by status"""
        dashboard = AdminDashboard(page)
        students = dashboard.navigate_to_students()

        students.filter_by_status("aktif")

        page.wait_for_timeout(1000)

    def test_filter_students_by_course(self, page: Page):
        """Story 4.9: Filter students by course"""
        dashboard = AdminDashboard(page)
        students = dashboard.navigate_to_students()

        # Get first course option
        options = students.filter_course.locator("option")
        if options.count() > 1:
            second_option = options.nth(1)
            course_id = second_option.get_attribute("value")
            if course_id:
                students.filter_by_course(course_id)

        page.wait_for_timeout(1000)

    def test_student_notes_field(self, page: Page):
        """Story 4.10: Student notes field works"""
        dashboard = AdminDashboard(page)
        students = dashboard.navigate_to_students()
        students.click_add_student()

        # Wait for modal to fully load
        page.wait_for_timeout(1000)

        # Get first available course option if any
        course_options = students.course_select.locator('option')
        if course_options.count() <= 1:
            pytest.skip("No courses available to assign to student")

        # Get course label and select by label
        course_label = course_options.nth(1).text_content()
        students.course_select.select_option(label=course_label)

        students.fill_student_form(
            name="Notes Test",
            phone="6281111111111",
            mode="online",
            notes="This is a test note for the student"
        )
        students.submit_form()

        # After page reload, modal should be gone
        assert not students.modal.is_visible(), "Modal still visible after submit"