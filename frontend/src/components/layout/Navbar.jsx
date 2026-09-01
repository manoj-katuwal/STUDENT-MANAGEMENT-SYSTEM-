import { Bell, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/auth.context";

// kebab-case / camelCase route segment -> "Fee Structure" style title
const formatSegmentTitle = (segment) => {
  const spaced = segment.replace(/-/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter(Boolean);
  const currentTitle = pathnames[0]
    ? formatSegmentTitle(pathnames[0])
    : "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate/10 bg-white/80 backdrop-blur-md px-6 font-body">
      {/* Left: Breadcrumb / Page Context */}
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brass">
          FeeFlow
        </span>
        <span className="text-slate/30">/</span>
        <h2 className="font-display text-base font-semibold text-ink">
          {currentTitle}
        </h2>
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button
          type="button"
          className="relative rounded-full p-2 text-slate hover:bg-slate/10 hover:text-ink transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rust ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-slate/15" />

        {/* Profile Dropdown Trigger */}
        <div className="flex items-center gap-3 rounded-lg py-1 px-2 hover:bg-slate/5 transition-colors cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-parchment font-display font-semibold text-xs ring-2 ring-brass/30">
            {user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
          </div>

          <div className="hidden sm:block text-left leading-tight">
            <p className="font-semibold text-xs text-ink">
              {user?.name || "Guest"}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-brass">
              {user?.role || "User"}
            </p>
          </div>

          <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate/60" />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Logout"
          className="rounded-lg p-2 text-slate hover:bg-rust/10 hover:text-rust transition-colors"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
