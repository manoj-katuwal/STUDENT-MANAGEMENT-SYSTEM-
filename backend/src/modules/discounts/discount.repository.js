import Discount from "./discount.model.js";

export const createDiscount = async (discountData) => {
  return await Discount.create(discountData);
};

export const findActiveDiscountByStudentFeeId = async (studentFeeId) => {
  return await Discount.findOne({
    studentFeeId,
    status: "ACTIVE",
  });
};