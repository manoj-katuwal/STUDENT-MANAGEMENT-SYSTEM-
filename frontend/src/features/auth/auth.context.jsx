import { createContext, useContext, useState } from "react";

import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "../../utils/token";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(getAccessToken());
  const [user, setUser] = useState(null);

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

  const isAuthenticated = Boolean(accessToken);

  const value = {
    user,
    accessToken,
    isAuthenticated,
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
