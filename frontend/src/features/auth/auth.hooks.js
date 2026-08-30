import { useMutation } from "@tanstack/react-query";

import { loginUser, logoutUser } from "./auth.api";
import { useAuth } from "./auth.context";

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (response) => {
      const { user, accessToken } = response.data;

      login({
        user,
        accessToken,
      });
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      logout();
    },
  });
};
