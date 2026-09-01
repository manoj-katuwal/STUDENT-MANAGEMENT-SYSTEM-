import { useState, useRef, useEffect } from "react";
import {
  Bell,
  User as UserIcon,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/auth.context";

// kebab-case / camelCase route segment -> "Fee Structure" style title
const formatSegmentTitle = (segment) => {
  const spaced = segment.replace(/-/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pathnames = location.pathname.split("/").filter(Boolean);
  const currentTitle = pathnames[0]
    ? formatSegmentTitle(pathnames[0])
    : "Dashboard";

  // Outside click वा Escape key थिच्दा Dropdown बन्द गर्ने logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

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

      {/* Right: Actions + Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button
          type="button"
          className="rounded-full p-2 text-slate hover:bg-slate/10 hover:text-ink transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-slate/15" />

        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="flex items-center gap-3 rounded-lg py-1 px-2 hover:bg-slate/5 transition-colors cursor-pointer border border-transparent focus:outline-none focus:border-slate/20"
          >
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

            <ChevronDown
              className={`hidden sm:block h-3.5 w-3.5 text-slate/60 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Menu Card */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate/15 bg-white p-1.5 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Profile Link */}
              <button
                type="button"
                onClick={() => handleNavigate("/profile")}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-ink hover:bg-slate/5 transition-colors text-left"
              >
                <UserIcon className="h-4 w-4 text-slate" />
                <span>Profile</span>
              </button>

              {/* Settings Link */}
              <button
                type="button"
                onClick={() => handleNavigate("/settings")}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-ink hover:bg-slate/5 transition-colors text-left"
              >
                <Settings className="h-4 w-4 text-slate" />
                <span>Settings</span>
              </button>

              <div className="my-1 h-px bg-slate/10" />

              {/* Logout Option */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rust hover:bg-rust/10 transition-colors text-left"
              >
                <LogOut className="h-4 w-4 text-rust" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
