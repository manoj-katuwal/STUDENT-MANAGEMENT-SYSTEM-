import { getMonthlyCollection, getPendingFeeTotal, getTodayCollection } from "./reports.repository.js";

export const getTodayCollectionService = async () => {
  const totalCollection = await getTodayCollection();

  return {
    totalCollection,
  };
};

export const getMonthlyCollectionService = async () => {
  const totalCollection = await getMonthlyCollection();

  return {
    totalCollection,
  };
};

export const getPendingFeeTotalService = async () => {
  const totalPending = await getPendingFeeTotal();

  return {
    totalPending,
  };
};
