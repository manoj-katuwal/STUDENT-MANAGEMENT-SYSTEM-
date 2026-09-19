import PaymentReferenceCounter from "./paymentReferenceCounter.model.js";

export const generatePaymentReference = async (options = {}) => {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const counter = await PaymentReferenceCounter.findOneAndUpdate(
    { date },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      ...options,
    },
  );

  return `PAY-${date}-${String(counter.sequence).padStart(4, "0")}`;
};
