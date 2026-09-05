import { useState } from "react";

import UsersFilter from "../components/users/UsersFilter";
import UsersHeader from "../components/users/UsersHeader";
import UsersTable from "../components/users/UsersTable";
import UsersPagination from "../components/users/UsersPagination";
import DeleteUserModal from "../components/users/DeleteUserModal";

import { useUsers, useDeleteUser } from "../features/user/user.hooks";
import useDebounce from "../hooks/useDebounce";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 700);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;

    const userId = selectedUser._id || selectedUser.id;

    deleteUser(userId, {
      onSuccess: () => {
        setSelectedUser(null);
      },
    });
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;

    setSelectedUser(null);
  };

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
      <UsersTable users={users} onDelete={handleDeleteUser} />

      {pagination && pagination.totalUsers > 0 && (
        <UsersPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalUsers={pagination.totalUsers}
          limit={pagination.limit}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete User Confirmation Modal */}
      <DeleteUserModal
        isOpen={Boolean(selectedUser)}
        user={selectedUser}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default UsersPage;
