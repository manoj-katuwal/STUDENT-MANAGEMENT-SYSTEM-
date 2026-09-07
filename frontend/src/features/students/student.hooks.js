import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStudentById, getStudents, getStudentStats } from "./student.api";

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
