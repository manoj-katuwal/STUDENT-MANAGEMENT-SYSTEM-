import FinePolicy from "./finePolicy.model.js";

export const createFinePolicy = async (data) => {
  return await FinePolicy.create(data);
};

export const findFinePolicyById = async (id) => {
  return await FinePolicy.findById(id);
};

export const findActiveFinePoliciesByFeeType = async (
  academicYearId,
  feeType,
) => {
  return await FinePolicy.find({
    academicYearId,
    applicableFeeTypes: feeType,
    status: "ACTIVE",
  });
};
