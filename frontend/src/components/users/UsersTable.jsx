import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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

const DEFAULT_ROLE_CONFIG = {
  label: "User",
  badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
};

// ── Portal Dropdown ────────────────────────────────────────────────────────────
const ActionMenu = ({
  anchorRef,
  onClose,
  isUserActive,
  onDelete,
  onToggleStatus,
  onChangeRole,
}) => {
  const [style, setStyle] = useState({});
  const menuRef = useRef(null);

  // Calculate position from anchor button
  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const menuHeight = 160; // approx height of the menu
    const spaceBelow = window.innerHeight - rect.bottom;

    const top =
      spaceBelow >= menuHeight ? rect.bottom + 4 : rect.top - menuHeight - 4;

    setStyle({
      position: "fixed",
      top,
      right: window.innerWidth - rect.right,
      width: 176,
      zIndex: 9999,
    });
  }, [anchorRef]);

  // Close on outside click / scroll / resize
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !anchorRef.current?.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
    };
  }, [onClose, anchorRef]);

  return createPortal(
    <div
      ref={menuRef}
      style={style}
      className="bg-white rounded-xl shadow-xl border border-gray-200 py-1 text-left"
    >
      <button
        onClick={onClose}
        className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <Eye className="w-3.5 h-3.5 text-gray-400" />
        View Profile
      </button>

      <button
        onClick={() => {
          onClose();
          onChangeRole?.();
        }}
        className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <Shield className="w-3.5 h-3.5 text-gray-400" />
        Change Role
      </button>

      {isUserActive ? (
        <button
          onClick={() => {
            onClose();
            onToggleStatus?.();
          }}
          className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <UserX className="w-3.5 h-3.5 text-amber-500" />
          Deactivate
        </button>
      ) : (
        <button
          onClick={() => {
            onClose();
            onToggleStatus?.();
          }}
          className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          Activate
        </button>
      )}

      <div className="my-1 border-t border-gray-100" />

      <button
        onClick={() => {
          onClose();
          onDelete?.();
        }}
        className="w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <Trash2 className="w-3.5 h-3.5 text-red-500" />
        Delete User
      </button>
    </div>,
    document.body,
  );
};

// ── Row Component ──────────────────────────────────────────────────────────────
const UserRow = ({ user, onDelete, onToggleStatus, onChangeRole }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef(null);

  const userId = user._id || user.id;
  const roleConfig = ROLE_CONFIG[user.role] || DEFAULT_ROLE_CONFIG;
  const isUserActive = Boolean(user.isActive);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const close = useCallback(() => setMenuOpen(false), []);

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      {/* User */}
      <td className="py-3.5 px-4 lg:px-6 font-medium text-gray-900 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-300">
            {initials}
          </div>
          <span className="truncate max-w-40">{user.name}</span>
        </div>
      </td>

      {/* Email */}
      <td className="py-3.5 px-4 lg:px-6 text-gray-600 whitespace-nowrap text-sm">
        {user.email}
      </td>

      {/* Role */}
      <td className="py-3.5 px-4 lg:px-6 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleConfig.badgeClass}`}
        >
          {roleConfig.label}
        </span>
      </td>

      {/* Status */}
      <td className="py-3.5 px-4 lg:px-6 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${isUserActive ? "bg-emerald-500" : "bg-gray-400"}`}
          />
          <span className="text-xs text-gray-600">
            {isUserActive ? "Active" : "Inactive"}
          </span>
        </div>
      </td>

      {/* Created */}
      <td className="py-3.5 px-4 lg:px-6 text-gray-500 whitespace-nowrap text-xs">
        {formatDate(user.createdAt)}
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 lg:px-6 text-right whitespace-nowrap">
        <button
          ref={btnRef}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={`Actions for ${user.name}`}
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <ActionMenu
            anchorRef={btnRef}
            onClose={close}
            isUserActive={isUserActive}
            onDelete={() => onDelete?.(user)}
            onToggleStatus={() => onToggleStatus?.(user)}
            onChangeRole={() => onChangeRole?.(user)}
          />
        )}
      </td>
    </tr>
  );
};

// ── Main Table ─────────────────────────────────────────────────────────────────
const UsersTable = ({
  users = [],
  onDelete,
  onToggleStatus,
  onChangeRole,
  error = null,
}) => {
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

          <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
            {users.map((user) => (
              <UserRow
                key={user._id || user.id}
                user={user}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                onChangeRole={onChangeRole}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
