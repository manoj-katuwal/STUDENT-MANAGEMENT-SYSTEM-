import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getSections, getSectionStats, getSectionById, createSection, updateSectionStatus, updateSection } from "./section.api";

export const useSections = (params = {}) => {
  return useQuery({
    queryKey: ["sections", params],
    queryFn: () => getSections(params),
    placeholderData: keepPreviousData,
  });
};

export const useSectionStats = () => {
  return useQuery({
    queryKey: ["section-stats"],
    queryFn: getSectionStats,
  });
};

export const useSection = (sectionId) => {
  return useQuery({
    queryKey: ["section", sectionId],
    queryFn: () => getSectionById(sectionId),
    enabled: Boolean(sectionId),
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["section-stats"] });
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, data }) => updateSection(sectionId, data),
    onSuccess: (updatedSection, variables) => {
      queryClient.setQueryData(
        ["section", variables.sectionId],
        updatedSection,
      );

      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["section-stats"] });
    },
  });
};

export const useUpdateSectionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, status }) =>
      updateSectionStatus(sectionId, status),
    onSuccess: (updatedSection, variables) => {
      queryClient.setQueryData(
        ["section", variables.sectionId],
        updatedSection,
      );

      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["section-stats"] });
    },
  });
};
