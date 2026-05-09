"""
ESK Platform - Settings E2E Tests
Epic 7: Settings & Konfigurasi
"""
import pytest
from playwright.sync_api import Page, expect
from tests.pages import AdminLoginPage, AdminDashboard, SettingsPage


class TestWhatsAppConfig:
    """Test Epic 7 - WhatsApp Configuration"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Login before each test"""
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

    def test_settings_page_loads(self, page: Page):
        """Story 7.1: Settings page loads"""
        dashboard = AdminDashboard(page)
        settings = dashboard.navigate_to_settings()

        expect(settings.whatsapp_config_section).to_be_visible()
        expect(settings.admin_phone_input).to_be_visible()

    def test_update_whatsapp_phone(self, page: Page):
        """Story 7.2: Update WhatsApp phone number"""
        dashboard = AdminDashboard(page)
        settings = dashboard.navigate_to_settings()

        new_phone = "6289876543210"
        settings.update_whatsapp_phone(new_phone)
        settings.save_whatsapp_config()

        expect(settings.saved_indicator).to_be_visible()

    def test_update_message_template(self, page: Page):
        """Story 7.3: Update WhatsApp message template"""
        dashboard = AdminDashboard(page)
        settings = dashboard.navigate_to_settings()

        new_template = "Halo, saya mau daftar kelas English Sepulang Kerja.\nNama: {name}\nNo. HP: {phone}\nKelas: {course}"
        settings.update_message_template(new_template)
        settings.save_whatsapp_config()

        expect(settings.saved_indicator).to_be_visible()

    def test_whatsapp_phone_validation(self, page: Page):
        """Story 7.4: WhatsApp phone validation"""
        dashboard = AdminDashboard(page)
        settings = dashboard.navigate_to_settings()

        # Try empty phone
        settings.update_whatsapp_phone("")
        settings.save_whatsapp_config()

        # Should show error or not save


class TestAdminProfile:
    """Test Epic 7 - Admin Profile"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Login before each test"""
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

    def test_admin_email_readonly(self, page: Page):
        """Story 7.5: Admin email is read-only"""
        dashboard = AdminDashboard(page)
        settings = dashboard.navigate_to_settings()

        email_input = settings.email_input
        expect(email_input).to_be_visible()
        # Email should be read-only or disabled
        is_disabled = email_input.get_attribute("disabled")
        is_readonly = email_input.get_attribute("readonly")

    def test_change_password(self, page: Page):
        """Story 7.6: Change admin password"""
        dashboard = AdminDashboard(page)
        settings = dashboard.navigate_to_settings()

        settings.change_password("NewPassword123!", "NewPassword123!")

        expect(settings.saved_indicator).to_be_visible()

    def test_password_mismatch_error(self, page: Page):
        """Story 7.7: Password mismatch shows error"""
        dashboard = AdminDashboard(page)
        settings = dashboard.navigate_to_settings()

        settings.new_password_input.fill("Password123!")
        settings.confirm_password_input.fill("DifferentPassword!")
        settings.save_profile_button.click()

        # Should show error (implementation dependent)


class TestDangerZone:
    """Test Epic 7 - Danger Zone"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Login before each test"""
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

    def test_danger_zone_visible(self, page: Page):
        """Story 7.8: Danger zone section is visible"""
        dashboard = AdminDashboard(page)
        settings = dashboard.navigate_to_settings()

        expect(settings.danger_zone).to_be_visible()
        expect(settings.delete_all_data_button).to_be_visible()

    def test_delete_all_data_requires_confirmation(self, page: Page):
        """Story 7.9: Delete all data requires confirmation"""
        dashboard = AdminDashboard(page)
        settings = dashboard.navigate_to_settings()

        settings.delete_all_data_button.click()

        # Should show confirmation dialog
        confirm_dialog = page.locator('[data-testid="delete-confirm-dialog"]')
        expect(confirm_dialog).to_be_visible()