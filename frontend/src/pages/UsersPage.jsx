
import { useUsers } from "../features/user/user.hooks";

const Users = () => {
  const { data: users, isLoading, isError, refetch } = useUsers();

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
    <div>
      <h1>Users</h1>

      <p>Total Users: {users?.length || 0}</p>
    </div>
  );
};

export default Users;
