# Routing & Permissions

Routes defined in `moduleDefinitions` array. Each module has a `permission` ID. `filterAccessibleModules()` filters routes by `LoginController.userModules` (array of permission IDs). Supports nested `children` routes.

Active modules: Dashboard, Clients, Settings, Admin, Help Center.

Routes use `/app` (authenticated) and `/demo` (demo mode) base paths. Layout: AppShell with Header + collapsible Navbar + Main (Outlet).
