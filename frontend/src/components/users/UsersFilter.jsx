import React from "react";
import { Search, ChevronDown } from "lucide-react";

const UsersFilter = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="user-search"
            aria-label="Search users by name or email"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Role Select */}
          <div className="relative flex-1 sm:w-44">
            <label htmlFor="role-filter" className="sr-only">
              Filter by Role
            </label>
            <select
              id="role-filter"
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 pr-8 text-sm text-gray-700 cursor-pointer transition-colors duration-150 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="ACCOUNTANT">ACCOUNTANT</option>
              <option value="PRINCIPAL">PRINCIPAL</option>
              <option value="STUDENT">STUDENT</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Status Select */}
          <div className="relative flex-1 sm:w-40">
            <label htmlFor="status-filter" className="sr-only">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 pr-8 text-sm text-gray-700 cursor-pointer transition-colors duration-150 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersFilter;
