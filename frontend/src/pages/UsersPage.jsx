import { useState } from "react";
import UsersFilter from "../components/users/UsersFilter";
import UsersHeader from "../components/users/UsersHeader";
import { useUsers } from "../features/user/user.hooks";
import UsersTable from "../components/users/UsersTable";

const UsersPage = () => {
  const { data: users, isLoading, isError, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  console.log("Users:", users);

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    return (
      <div>
        <p>Unable to load users.</p>

        <button onClick={refetch}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <UsersHeader />

      <UsersFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <UsersTable users={[]} />
    </div>
  );
};

export default UsersPage;
