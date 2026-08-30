import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authStore } from "./auth.store";

import {
  refreshAccessToken,
  getCurrentUser,
} from "./auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const login = ({ user, accessToken }) => {
    authStore.setAccessToken(accessToken);

    setAccessTokenState(accessToken);
    setUser(user);
  };

  const logout = () => {
    authStore.clearAccessToken();

    setAccessTokenState(null);
    setUser(null);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const refreshResponse = await refreshAccessToken();

        const newAccessToken =
          refreshResponse.data.accessToken;

        authStore.setAccessToken(newAccessToken);

        setAccessTokenState(newAccessToken);

        const userResponse = await getCurrentUser();

        setUser(userResponse.data);
      } catch (error) {
        authStore.clearAccessToken();

        setAccessTokenState(null);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, []);

  const isAuthenticated = Boolean(accessToken && user);

  const value = {
    user,
    accessToken,
    isAuthenticated,
    isInitializing,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};