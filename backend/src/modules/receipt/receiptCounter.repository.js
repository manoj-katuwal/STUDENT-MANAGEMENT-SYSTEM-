import ReceiptCounter from "./receiptCounter.model.js";

export const getNextReceiptSequence = async (
  year,
  options = {},
) => {
  const counter = await ReceiptCounter.findOneAndUpdate(
    { year },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      ...options,
    },
  );

  return counter.sequence;
};