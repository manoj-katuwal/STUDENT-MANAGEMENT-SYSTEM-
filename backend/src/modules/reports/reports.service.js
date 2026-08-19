import { getTodayCollection } from "./reports.repository.js";

export const getTodayCollectionService = async () => {
  const totalCollection = await getTodayCollection();

  return {
    totalCollection,
  };
};
