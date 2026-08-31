export const formatCurrency = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "Rs. 0";
  }

  return `Rs. ${numericAmount.toLocaleString("en-NP")}`;
};
