import { useMutation } from "@tanstack/react-query";

import { loginUser } from "./auth.api";
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
