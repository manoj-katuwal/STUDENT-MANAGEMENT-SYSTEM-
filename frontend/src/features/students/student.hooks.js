import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStudents, getStudentStats } from "./student.api";

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
