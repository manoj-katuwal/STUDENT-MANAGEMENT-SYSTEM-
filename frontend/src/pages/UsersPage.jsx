import { useState } from "react";

import UsersFilter from "../components/users/UsersFilter";
import UsersHeader from "../components/users/UsersHeader";
import UsersTable from "../components/users/UsersTable";

import { useUsers } from "../features/user/user.hooks";
import useDebounce from "../hooks/useDebounce";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const params = {
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm || undefined,
    role: selectedRole || undefined,
    isActive:
      selectedStatus === "true" || selectedStatus === "active"
        ? true
        : selectedStatus === "false" || selectedStatus === "inactive"
          ? false
          : undefined,
  };

  const { data, isLoading, isError, refetch } = useUsers(params);

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  console.log("Users:", users);
  console.log("Pagination:", pagination);

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    return (
      <div>
        <p>Unable to load users.</p>

        <button type="button" onClick={refetch}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <UsersHeader />

      <UsersFilter
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        selectedRole={selectedRole}
        onRoleChange={(value) => {
          setSelectedRole(value);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(value) => {
          setSelectedStatus(value);
          setCurrentPage(1);
        }}
      />

      <UsersTable users={users} />

      {/* Pagination will come here */}
    </div>
  );
};

export default UsersPage;
