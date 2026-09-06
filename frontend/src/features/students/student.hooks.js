import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStudents } from "./student.api";

export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
    placeholderData: keepPreviousData,
  });
};
