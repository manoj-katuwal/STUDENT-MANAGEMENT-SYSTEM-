import { useQuery } from "@tanstack/react-query";

import { getSections, getSectionStats, getSectionById } from "./section.api";

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
