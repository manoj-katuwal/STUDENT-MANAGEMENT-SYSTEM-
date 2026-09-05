import {
  useQuery,
  keepPreviousData,
  useMutation,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getUsers,
  deleteUser,
  activateUser,
  deactivateUser,
  changeUserRole,
} from "./user.api";

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

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }) => changeUserRole(userId, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
