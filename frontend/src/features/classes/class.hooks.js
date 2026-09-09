import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  updateClassStatus,
  getClassStats,
} from "./class.api";

export const useClasses = (params = {}) => {
  return useQuery({
    queryKey: ["classes", params],
    queryFn: () => getClasses(params),
    placeholderData: keepPreviousData,
  });
};

export const useClass = (classId) => {
  return useQuery({
    queryKey: ["class", classId],
    queryFn: () => getClassById(classId),
    enabled: Boolean(classId),
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClass,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });

      queryClient.invalidateQueries({
        queryKey: ["class-stats"],
      });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }) => updateClass(classId, data),

    onSuccess: (updatedClass, variables) => {
      queryClient.setQueryData(["class", variables.classId], updatedClass);

      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });
    },
  });
};

export const useUpdateClassStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, status }) => updateClassStatus(classId, status),

    onSuccess: (updatedClass, variables) => {
      queryClient.setQueryData(["class", variables.classId], updatedClass);

      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });

      queryClient.invalidateQueries({
        queryKey: ["class-stats"],
      });
    },
  });
};

export const useClassStats = () => {
  return useQuery({
    queryKey: ["class-stats"],
    queryFn: getClassStats,
  });
};
