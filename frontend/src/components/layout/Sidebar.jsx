import { NavLink } from "react-router-dom";

import { NAV_ITEMS } from "../../config/navigation";
import { useAuth } from "../../features/auth/auth.context";

const Sidebar = () => {
  const { user } = useAuth();

  const allowedNavigationItems = NAV_ITEMS.filter((item) =>
    item.allowedRoles.includes(user?.role),
  );

  return (
    <aside className="min-h-screen w-64 border-r bg-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Student Fee System</h1>
      </div>

      <nav>
        <ul className="space-y-2">
          {allowedNavigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block rounded px-4 py-2 ${
                    isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
