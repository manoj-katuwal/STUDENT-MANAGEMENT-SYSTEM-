import { createContext, useContext, useEffect, useState } from "react";

import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "../../utils/token";

import { refreshAccessToken, getCurrentUser } from "./auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(getAccessToken());

  const [user, setUser] = useState(null);

  const [isInitializing, setIsInitializing] = useState(true);

  const login = ({ user, accessToken }) => {
    setAccessToken(accessToken);

    setAccessTokenState(accessToken);

    setUser(user);
  };

  const logout = () => {
    removeAccessToken();

    setAccessTokenState(null);

    setUser(null);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        /**
         * First try the existing access token.
         */
        let token = getAccessToken();

        if (!token) {
          /**
           * Access token missing → use refresh cookie.
           */
          const refreshResponse = await refreshAccessToken();

          token = refreshResponse.data.accessToken;

          setAccessToken(token);

          setAccessTokenState(token);
        }

        /**
         * Fetch the currently logged-in user.
         */
        const userResponse = await getCurrentUser();

        setUser(userResponse.data);
      } catch (error) {
        /**
         * Session is invalid or expired.
         */
        removeAccessToken();

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
