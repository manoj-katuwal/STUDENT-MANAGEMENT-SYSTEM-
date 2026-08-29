import { createContext, useContext, useState } from "react";
import { getAccessToken } from "../../utils/token";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(getAccessToken());
  const [user, setUser] = useState(null);

  const isAuthenticated = Boolean(accessToken);

  const value = {
    user,
    accessToken,
    isAuthenticated,
    setUser,
    setAccessTokenState,
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
