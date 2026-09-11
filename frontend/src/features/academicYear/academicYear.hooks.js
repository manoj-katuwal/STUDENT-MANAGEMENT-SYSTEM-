import {
    activateAcademicYear,
  createAcademicYear,
  deactivateAcademicYear,
  getAcademicYearById,
  getAcademicYears,
  updateAcademicYear,
} from "./academicYear.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAcademicYears = (params = {}) => {
  return useQuery({
    queryKey: ["academicYears", params],
    queryFn: () => getAcademicYears(params),
  });
};

export const useAcademicYear = (academicYearId) => {
  return useQuery({
    queryKey: ["academicYear", academicYearId],
    queryFn: () => getAcademicYearById(academicYearId),
    enabled: Boolean(academicYearId),
  });
};

export const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["academicYears"],
      });
    },
  });
};

export const useUpdateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ academicYearId, academicYearData }) =>
      updateAcademicYear(academicYearId, academicYearData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["academicYears"],
      });

      queryClient.invalidateQueries({
        queryKey: ["academicYear", variables.academicYearId],
      });
    },
  });
};

export const useActivateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateAcademicYear,

    onSuccess: (_, academicYearId) => {
      queryClient.invalidateQueries({
        queryKey: ["academicYears"],
      });

      queryClient.invalidateQueries({
        queryKey: ["academicYear", academicYearId],
      });
    },
  });
};

export const useDeactivateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateAcademicYear,

    onSuccess: (_, academicYearId) => {
      queryClient.invalidateQueries({
        queryKey: ["academicYears"],
      });

      queryClient.invalidateQueries({
        queryKey: ["academicYear", academicYearId],
      });
    },
  });
};
