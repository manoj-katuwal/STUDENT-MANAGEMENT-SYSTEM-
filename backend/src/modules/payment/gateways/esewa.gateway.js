import crypto from "crypto";

const {
  ESEWA_PRODUCT_CODE,
  ESEWA_SECRET_KEY,
  ESEWA_PAYMENT_URL,
  ESEWA_STATUS_URL,
  FRONTEND_SUCCESS_URL,
  FRONTEND_FAILURE_URL,
} = process.env;

const generateSignature = (message) => {
  return crypto
    .createHmac("sha256", ESEWA_SECRET_KEY)
    .update(message)
    .digest("base64");
};

export const buildEsewaPaymentPayload = ({ amount, transactionUuid }) => {
  const totalAmount = amount;

  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;

  const signature = generateSignature(message);

  return {
    paymentUrl: ESEWA_PAYMENT_URL,
    formData: {
      amount,
      tax_amount: 0,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: FRONTEND_SUCCESS_URL,
      failure_url: FRONTEND_FAILURE_URL,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    },
  };
};

export const decodeEsewaCallback = (base64Data) => {
  const decoded = Buffer.from(base64Data, "base64").toString("utf-8");
  return JSON.parse(decoded);
};

export const verifyEsewaSignature = (data) => {
  const signedFieldNames = data.signed_field_names.split(",");

  const message = signedFieldNames
    .map((field) => `${field}=${data[field]}`)
    .join(",");

  const expectedSignature = generateSignature(message);

  return expectedSignature === data.signature;
};

export const checkEsewaStatus = async ({ totalAmount, transactionUuid }) => {
  const url = `${ESEWA_STATUS_URL}?product_code=${ESEWA_PRODUCT_CODE}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;

  const response = await fetch(url);
  const result = await response.json();

  return result; 
};
