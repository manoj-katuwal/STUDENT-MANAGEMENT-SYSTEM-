import { useState } from "react";
import {
  MoreVertical,
  Eye,
  Shield,
  UserCheck,
  Trash2,
  UserX,
} from "lucide-react";
import formatDate from "../../utils/formatDate";

// Role Label and Style Configurations (Clean Lookup Maps)
const ROLE_CONFIG = {
  ADMIN: {
    label: "Admin",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  ACCOUNTANT: {
    label: "Accountant",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  PRINCIPAL: {
    label: "Principal",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  STUDENT: {
    label: "Student",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

// Fallback configuration for safety
const DEFAULT_ROLE_CONFIG = {
  label: "User",
  badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
};

// Date formatter helper
// const formatDate = (dateString) => {
//   if (!dateString) return "N/A";
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

const UsersTable = ({ users = [] }) => {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const toggleActionMenu = (id) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  // 1. Empty State Rendering
  if (!users || users.length === 0) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">
          No users found
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Try adjusting your search or filter parameters to find what you're
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="w-full text-left border-collapse"
          aria-label="Users list table"
        >
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th scope="col" className="py-3.5 px-4 lg:px-6">
                User
              </th>
              <th scope="col" className="py-3.5 px-4 lg:px-6">
                Email
              </th>
              <th scope="col" className="py-3.5 px-4 lg:px-6">
                Role
              </th>
              <th scope="col" className="py-3.5 px-4 lg:px-6">
                Status
              </th>
              <th scope="col" className="py-3.5 px-4 lg:px-6">
                Created
              </th>
              <th scope="col" className="py-3.5 px-4 lg:px-6 text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
            {users.map((user) => {
              const userId = user._id || user.id;
              const roleConfig = ROLE_CONFIG[user.role] || DEFAULT_ROLE_CONFIG;
              const isUserActive = Boolean(user.isActive);

              // Helper to generate User Initials (e.g. "Manoj Katwal" -> "MK")
              const initials = user.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U";

              return (
                <tr
                  key={userId}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* User Avatar Initials & Name */}
                  <td className="py-4 px-4 lg:px-6 font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-300">
                        {initials}
                      </div>
                      <span className="truncate">{user.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4 lg:px-6 text-gray-600 whitespace-nowrap">
                    {user.email}
                  </td>

                  {/* Role Badge */}
                  <td className="py-4 px-4 lg:px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleConfig.badgeClass}`}
                    >
                      {roleConfig.label}
                    </span>
                  </td>

                  {/* Status Indicator */}
                  <td className="py-4 px-4 lg:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${isUserActive ? "bg-emerald-500" : "bg-gray-400"}`}
                      />
                      <span className="text-sm text-gray-600">
                        {isUserActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-4 lg:px-6 text-gray-500 whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-4 px-4 lg:px-6 text-right whitespace-nowrap relative">
                    <button
                      onClick={() => toggleActionMenu(userId)}
                      aria-label={`Actions for ${user.name}`}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Popover Action Menu */}
                    {activeMenuId === userId && (
                      <>
                        {/* Backdrop to close menu */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveMenuId(null)}
                        />

                        <div className="absolute right-6 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 text-left">
                          <button
                            onClick={() => setActiveMenuId(null)}
                            className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                            View Profile
                          </button>
                          <button
                            onClick={() => setActiveMenuId(null)}
                            className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Shield className="w-3.5 h-3.5 text-gray-400" />
                            Change Role
                          </button>

                          {/* Dynamic Action Icon & Text */}
                          {isUserActive ? (
                            <button
                              onClick={() => setActiveMenuId(null)}
                              className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <UserX className="w-3.5 h-3.5 text-amber-500" />
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => setActiveMenuId(null)}
                              className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                              Activate
                            </button>
                          )}

                          <div className="my-1 border-t border-gray-100" />
                          <button
                            onClick={() => setActiveMenuId(null)}
                            className="w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            Delete User
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
