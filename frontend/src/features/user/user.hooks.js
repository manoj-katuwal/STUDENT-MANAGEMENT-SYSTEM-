import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./user.api";

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
};
