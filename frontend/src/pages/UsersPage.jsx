import { useState } from "react";

import UsersFilter from "../components/users/UsersFilter";
import UsersHeader from "../components/users/UsersHeader";
import UsersTable from "../components/users/UsersTable";
import UsersPagination from "../components/users/UsersPagination";
import DeleteUserModal from "../components/users/DeleteUserModal";
import UserStatusModal from "../components/users/UserStatusModal";
import ChangeRoleModal from "../components/users/ChangeRoleModal";

import {
  useUsers,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  useChangeUserRole,
} from "../features/user/user.hooks";
import useDebounce from "../hooks/useDebounce";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusUser, setStatusUser] = useState(null);
  const [roleUser, setRoleUser] = useState(null);
  const [selectedNewRole, setSelectedNewRole] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const {
    mutate: deleteUser,
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteUser();

  const {
    mutate: activateUser,
    isPending: isActivating,
    error: activateError,
    reset: resetActivate,
  } = useActivateUser();

  const {
    mutate: deactivateUser,
    isPending: isDeactivating,
    error: deactivateError,
    reset: resetDeactivate,
  } = useDeactivateUser();

  const {
    mutate: changeUserRole,
    isPending: isChangingRole,
    error: changeRoleError,
    reset: resetChangeRole,
  } = useChangeUserRole();

  const handleDeleteUser = (user) => {
    resetDelete?.();
    setSelectedUser(user);
  };

  const handleOpenStatusModal = (user) => {
    resetActivate?.();
    resetDeactivate?.();
    setStatusUser(user);
  };

  const handleCloseStatusModal = () => {
    if (isActivating || isDeactivating) return;
    resetActivate?.();
    resetDeactivate?.();
    setStatusUser(null);
  };

  const handleConfirmStatusChange = () => {
    if (!statusUser) return;
    const userId = statusUser._id || statusUser.id;

    if (statusUser.isActive) {
      deactivateUser(userId, {
        onSuccess: () => {
          handleCloseStatusModal();
        },
      });
    } else {
      activateUser(userId, {
        onSuccess: () => {
          handleCloseStatusModal();
        },
      });
    }
  };

  const handleOpenRoleModal = (user) => {
    resetChangeRole?.();
    setRoleUser(user);
    setSelectedNewRole(user.role || "");
  };

  const handleCloseRoleModal = () => {
    if (isChangingRole) return;
    resetChangeRole?.();
    setRoleUser(null);
    setSelectedNewRole("");
  };

  const handleConfirmRoleChange = () => {
    if (!roleUser || !selectedNewRole || selectedNewRole === roleUser.role)
      return;

    const userId = roleUser._id || roleUser.id;

    changeUserRole(
      { userId, role: selectedNewRole },
      {
        onSuccess: () => {
          handleCloseRoleModal();
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;

    const userId = selectedUser._id || selectedUser.id;

    deleteUser(userId, {
      onSuccess: () => {
        setSelectedUser(null);

        if (users.length === 1 && currentPage > 1) {
          setCurrentPage((page) => page - 1);
        }
      },
    });
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;

    resetDelete?.();
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
      <UsersTable
        users={users}
        onDelete={handleDeleteUser}
        onToggleStatus={handleOpenStatusModal}
        onChangeRole={handleOpenRoleModal}
      />

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
        error={isDeleteError ? deleteError : null}
      />

      {/* User Status (Activate/Deactivate) Confirmation Modal */}
      <UserStatusModal
        isOpen={Boolean(statusUser)}
        user={statusUser}
        action={statusUser?.isActive ? "deactivate" : "activate"}
        onClose={handleCloseStatusModal}
        onConfirm={handleConfirmStatusChange}
        isPending={isActivating || isDeactivating}
        error={activateError || deactivateError}
      />

      {/* Change User Role Modal */}
      <ChangeRoleModal
        isOpen={Boolean(roleUser)}
        user={roleUser}
        selectedRole={selectedNewRole}
        onRoleChange={setSelectedNewRole}
        onClose={handleCloseRoleModal}
        onConfirm={handleConfirmRoleChange}
        isPending={isChangingRole}
        error={changeRoleError}
      />
    </div>
  );
};

export default UsersPage;
