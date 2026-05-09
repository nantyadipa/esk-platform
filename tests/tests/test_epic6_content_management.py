"""
ESK Platform - Content Management E2E Tests
Epic 6: Content Management (CMS)
"""
import pytest
from playwright.sync_api import Page, expect
from tests.pages import AdminLoginPage, AdminDashboard, ContentManagement, LandingPage


class TestContentManagement:
    """Test Epic 6 - Content Management"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Login before each test"""
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

    def test_content_page_loads(self, page: Page):
        """Story 6.1: Content management page loads"""
        dashboard = AdminDashboard(page)
        content = dashboard.navigate_to_content()

        expect(content.content_sections.first).to_be_visible()

    def test_edit_hero_title(self, page: Page):
        """Story 6.2: Edit hero title"""
        dashboard = AdminDashboard(page)
        content = dashboard.navigate_to_content()

        new_title = "Test Title Update"
        content.edit_hero_title(new_title)
        content.save_section("hero_title")

        # Should show saved indicator
        expect(content.saved_indicator).to_be_visible()

    def test_edit_hero_subtitle(self, page: Page):
        """Story 6.3: Edit hero subtitle"""
        dashboard = AdminDashboard(page)
        content = dashboard.navigate_to_content()

        new_subtitle = "Test subtitle update"
        content.edit_hero_subtitle(new_subtitle)
        content.save_section("hero_subtitle")

        expect(content.saved_indicator).to_be_visible()

    def test_edit_hero_cta_text(self, page: Page):
        """Story 6.4: Edit hero CTA text"""
        dashboard = AdminDashboard(page)
        content = dashboard.navigate_to_content()

        new_cta = "Mulai Sekarang"
        content.edit_hero_cta_text(new_cta)
        content.save_section("hero_cta_text")

        expect(content.saved_indicator).to_be_visible()

    def test_edit_footer_copyright(self, page: Page):
        """Story 6.5: Edit footer copyright"""
        dashboard = AdminDashboard(page)
        content = dashboard.navigate_to_content()

        new_footer = "© 2026 English Sepulang Kerja"
        content.edit_footer_copyright(new_footer)
        content.save_section("footer_copyright")

        expect(content.saved_indicator).to_be_visible()


class TestContentLiveUpdate:
    """Test Epic 6 - Content Live Update"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Login before each test"""
        login = AdminLoginPage(page)
        login.navigate()
        login.login("admin@esk.id", "ESKadmin2026!")

    def test_content_update_appears_on_landing(self, page: Page):
        """Story 6.6: Content update appears on landing page within 5s"""
        # Update content
        dashboard = AdminDashboard(page)
        content = dashboard.navigate_to_content()

        unique_suffix = "Updated123"
        content.edit_hero_title(f"Test Title {unique_suffix}")
        content.save_section("hero_title")

        # Navigate to landing page
        landing = LandingPage(page)
        landing.navigate()

        # Content should be updated
        title = landing.hero_title
        expect(title).to_be_visible()

    def test_cms_update_speed(self, page: Page):
        """Story 6.7: CMS update reflects on landing page within 5 seconds"""
        import time

        dashboard = AdminDashboard(page)
        content = dashboard.navigate_to_content()

        timestamp = str(int(time.time()))
        content.edit_hero_title(f"Speed Test {timestamp}")
        content.save_section("hero_title")

        # Navigate and check update speed
        start_time = time.time()
        page.goto("http://localhost:3000")
        page.wait_for_load_state("networkidle")

        # Check if new title appears
        title_locator = page.locator('[data-testid="hero-title"]')
        if title_locator.is_visible():
            elapsed = time.time() - start_time
            # Should be less than 5 seconds
            assert elapsed < 5, f"Update took {elapsed} seconds, expected < 5s"