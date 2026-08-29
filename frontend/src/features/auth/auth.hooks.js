import { useMutation } from "@tanstack/react-query";

import { loginUser } from "./auth.api";
import { setAccessToken } from "../../utils/token";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,

    onSuccess: (response) => {
      const { accessToken } = response.data;

      setAccessToken(accessToken);
    },
  });
};
