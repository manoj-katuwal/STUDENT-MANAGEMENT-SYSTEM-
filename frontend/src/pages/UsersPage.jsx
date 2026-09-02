import UsersHeader from "../components/users/UsersHeader";
import { useUsers } from "../features/user/user.hooks";

const UsersPage = () => {
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
    <div className="min-h-full p-6 lg:p-8">
      <UsersHeader />
    </div>
  );
};

export default UsersPage;
