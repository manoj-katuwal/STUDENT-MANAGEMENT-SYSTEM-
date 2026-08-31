import { useAuth } from "../../features/auth/auth.context";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold">Student Fee Management System</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">{user?.name}</p>

          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
