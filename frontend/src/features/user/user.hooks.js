import {
  useQuery,
  keepPreviousData,
  useMutation,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { getUsers, deleteUser } from "./user.api";

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
