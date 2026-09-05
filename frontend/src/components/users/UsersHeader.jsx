import { Plus } from "lucide-react";

const UsersHeader = ({ onAddUser }) => {
  return (
    <div className="flex items-center justify-between py-4">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Users
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage users, roles, and account access across the system.
        </p>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        className="inline-flex items-center gap-2 bg-[#0061ff] hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
        onClick={onAddUser}
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Add User</span>
      </button>
    </div>
  );
};

export default UsersHeader;
