import { NavLink } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";

import { getNavItemsForRole } from "../../config/navigation";
import { useAuth } from "../../features/auth/auth.context";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const allowedNavigationItems = getNavItemsForRole(user?.role);

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-ink text-parchment p-6">
      {/* Brand Header */}
      <div className="mb-10">
        <h1 className="font-display text-2xl font-semibold tracking-wide text-parchment">
          FeeFlow
        </h1>
        <p className="text-xs font-body text-slate mt-0.5">Management System</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1 font-body text-sm">
          {allowedNavigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all ${
                      isActive
                        ? "bg-white/10 text-parchment shadow-sm"
                        : "text-slate hover:bg-white/5 hover:text-parchment"
                    }`
                  }
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" />}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-slate/20 pt-4 font-body text-sm space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium transition-all ${
              isActive
                ? "bg-white/10 text-parchment"
                : "text-slate hover:bg-white/5 hover:text-parchment"
            }`
          }
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-slate hover:bg-white/5 hover:text-rust transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
