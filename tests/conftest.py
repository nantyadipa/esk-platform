"""
ESK Platform - Pytest Configuration
English Sepulang Kerja E2E Tests

Fitur:
- HTML Report otomatis di tests/reports/report.html
- Screenshot otomatis saat test gagal
- Console log capture
- Custom markers untuk epic management
- Logger kustom untuk tiap test

Cara menjalankan:
  python -m pytest tests/tests/test_epic1_landing_registration.py -v
  python -m pytest tests/tests/ -v --html=tests/reports/report.html
"""
import pytest
import logging
import os
from datetime import datetime
from playwright.sync_api import Page


# ============================================================================
# CONFIGURATION
# ============================================================================

REPORT_DIR = os.path.join(os.path.dirname(__file__), "reports")
SCREENSHOT_DIR = os.path.join(REPORT_DIR, "screenshots")
LOG_DIR = os.path.join(REPORT_DIR, "logs")

# Create directories
os.makedirs(REPORT_DIR, exist_ok=True)
os.makedirs(SCREENSHOT_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)


# ============================================================================
# FIXTURES
# ============================================================================

@pytest.fixture(scope="session")
def base_url():
    """Base URL untuk semua test"""
    return "http://localhost:3000"


@pytest.fixture(scope="session")
def admin_credentials():
    """Kredensial admin untuk test"""
    return {
        "email": "admin@esk.id",
        "password": "ESKadmin2026!"
    }


@pytest.fixture(scope="function")
def page(browser):
    """Create a new page untuk tiap test"""
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        locale="id-ID",
        timezone_id="Asia/Jakarta"
    )
    page = context.new_page()
    page.set_default_timeout(30000)

    # Start console log collection
    page.console_messages = []

    def handle_console(msg):
        page.console_messages.append(f"[{msg.type}] {msg.text}")

    page.on("console", handle_console)

    yield page

    context.close()


@pytest.fixture(scope="function")
def mobile_page(browser):
    """Create a mobile page untuk responsive tests"""
    context = browser.new_context(
        viewport={"width": 375, "height": 667},
        locale="id-ID",
        timezone_id="Asia/Jakarta",
        device_scale_factor=2,
        has_touch=True
    )
    page = context.new_page()

    yield page

    context.close()


@pytest.fixture(scope="function")
def authenticated_page(page: Page, admin_credentials):
    """Create an authenticated page untuk admin tests"""
    page.goto("http://localhost:3000/admin/login")
    page.wait_for_load_state("networkidle")

    page.fill('[data-testid="login-email"]', admin_credentials["email"])
    page.fill('[data-testid="login-password"]', admin_credentials["password"])
    page.click('[data-testid="login-submit"]')
    page.wait_for_load_state("networkidle")
    page.wait_for_url("**/admin/**", timeout=10000)

    return page


@pytest.fixture(scope="function")
def test_logger(request):
    """Logger kustom untuk tiap test function"""
    logger = logging.getLogger(request.node.nodeid)
    logger.setLevel(logging.INFO)

    # File handler
    log_file = os.path.join(LOG_DIR, f"{request.node.name}.log")
    fh = logging.FileHandler(log_file, mode='w')
    fh.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    logger.addHandler(fh)

    yield logger

    logger.removeHandler(fh)
    fh.close()


# ============================================================================
# PYTEST HOOKS & MARKERS
# ============================================================================

def pytest_configure(config):
    """Configure pytest dengan custom markers"""
    config.addinivalue_line(
        "markers", "epic1: marks tests as Epic 1 - Landing Page & Pendaftaran"
    )
    config.addinivalue_line(
        "markers", "epic2: marks tests as Epic 2 - Admin Authentication"
    )
    config.addinivalue_line(
        "markers", "epic3: marks tests as Epic 3 - Manajemen Kursus"
    )
    config.addinivalue_line(
        "markers", "epic4: marks tests as Epic 4 - Manajemen Siswa"
    )
    config.addinivalue_line(
        "markers", "epic5: marks tests as Epic 5 - Manajemen Jadwal"
    )
    config.addinivalue_line(
        "markers", "epic6: marks tests as Epic 6 - Content Management"
    )
    config.addinivalue_line(
        "markers", "epic7: marks tests as Epic 7 - Settings"
    )
    config.addinivalue_line(
        "markers", "smoke: marks tests as smoke tests"
    )
    config.addinivalue_line(
        "markers", "regression: marks tests as regression tests"
    )

    # Configure HTML report path
    if not config.option.htmlpath:
        config.option.htmlpath = os.path.join(REPORT_DIR, "report.html")


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Make test results available ke fixtures & capture screenshot on failure"""
    outcome = yield
    rep = outcome.get_result()

    setattr(item, f"rep_{rep.when}", rep)

    # Capture screenshot & logs on failure
    if rep.when == "call" and rep.failed:
        page = item.funcargs.get("page", None)
        if page and not page.is_closed():
            # Screenshot
            screenshot_path = os.path.join(
                SCREENSHOT_DIR,
                f"{item.name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            )
            try:
                page.screenshot(path=screenshot_path, full_page=True)
                print(f"\n[SCREENSHOT] {screenshot_path}")
            except Exception as e:
                print(f"\n[SCREENSHOT ERROR] {e}")

            # Console logs
            if hasattr(page, 'console_messages') and page.console_messages:
                log_path = os.path.join(
                    LOG_DIR,
                    f"{item.name}_console.log"
                )
                with open(log_path, 'w') as f:
                    for msg in page.console_messages:
                        f.write(msg + '\n')
                print(f"[CONSOLE LOGS] {log_path}")


def pytest_runtest_logreport(report):
    """Log test results ke terminal dengan emoji"""
    if report.when == "call":
        if report.passed:
            print(f"\n[PASS] {report.nodeid}")
        elif report.failed:
            print(f"\n[FAIL] {report.nodeid}")
            if hasattr(report, "longrepr"):
                print(f"   Error: {str(report.longrepr)[:200]}")


# ============================================================================
# HTML REPORT CONFIGURATION
# ============================================================================

def pytest_html_report_title(report):
    """Set HTML report title"""
    report.title = "ESK Platform - E2E Test Report"


def pytest_html_results_summary(prefix, summary, postfix):
    """Add summary ke HTML report"""
    prefix.extend([
        "<h2>ESK Platform - English Sepulang Kerja</h2>",
        "<p>End-to-End Test Report</p>",
    ])


def pytest_html_results_table_header(cells):
    """Customize table header"""
    cells.insert(2, "<th>Epic</th>")
    cells.insert(3, "<th>Console Logs</th>")


def pytest_html_results_table_row(report, cells):
    """Customize table row dengan epic marker dan console log link"""
    # Extract epic dari markers
    epic = "N/A"
    for marker in report.user_properties:
        if marker[0] == "epic":
            epic = marker[1]
            break

    cells.insert(2, f"<td>{epic}</td>")
    cells.insert(3, "<td>Available in logs/</td>")


# ============================================================================
# TERMINAL SUMMARY
# ============================================================================

def pytest_terminal_summary(terminalreporter, exitstatus, config):
    """Add custom summary ke terminal"""
    terminalreporter.write_sep("=", "ESK Platform E2E Test Summary")

    passed = len(terminalreporter.stats.get("passed", []))
    failed = len(terminalreporter.stats.get("failed", []))
    skipped = len(terminalreporter.stats.get("skipped", []))
    total = passed + failed + skipped

    terminalreporter.write_line(f"Total Tests: {total}")
    terminalreporter.write_line(f"Passed: {passed}")
    terminalreporter.write_line(f"Failed: {failed}")
    terminalreporter.write_line(f"Skipped: {skipped}")
    terminalreporter.write_line("")
    terminalreporter.write_line(f"HTML Report: {os.path.join(REPORT_DIR, 'report.html')}")
    terminalreporter.write_line(f"Screenshots: {SCREENSHOT_DIR}")
    terminalreporter.write_line(f"Logs: {LOG_DIR}")

    if failed == 0 and passed > 0:
        terminalreporter.write_line("")
        terminalreporter.write_line("All tests passed!")
    elif failed > 0:
        terminalreporter.write_line("")
        terminalreporter.write_line(f"{failed} test(s) failed. See details above.")
