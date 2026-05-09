[project]
test Suite = ESK Platform E2E Tests
Test Database = Supabase (Development)
Report Output = _bmad-output/testing-reports/html
Log Level = INFO

[test environments]
local.base_url = http://localhost:3000
admin.email = admin@esk.id
admin.password = ESKadmin2026!

[wait defaults]
navigation.timeout = 30000
element.timeout = 10000
default.delay = 500

[page object paths]
pages = tests/pages
tests = tests/tests