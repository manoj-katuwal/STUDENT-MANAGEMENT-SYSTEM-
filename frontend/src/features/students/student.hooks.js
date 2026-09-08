import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createStudent,
  getStudentById,
  getStudents,
  getStudentStats,
  updateStudent,
} from "./student.api";

export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
    placeholderData: keepPreviousData,
  });
};

export const useStudentStats = () => {
  return useQuery({
    queryKey: ["student-stats"],
    queryFn: getStudentStats,
  });
};

export const useStudent = (studentId) => {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getStudentById(studentId),
    enabled: Boolean(studentId),
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, data }) => updateStudent(studentId, data),

    onSuccess: (updatedStudent, variables) => {
      queryClient.setQueryData(
        ["student", variables.studentId],
        updatedStudent,
      );

      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      queryClient.invalidateQueries({
        queryKey: ["student-stats"],
      });
    },
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      queryClient.invalidateQueries({
        queryKey: ["student-stats"],
      });
    },
  });
};
