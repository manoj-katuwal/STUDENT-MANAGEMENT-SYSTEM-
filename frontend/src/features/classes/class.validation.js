export const validateClassForm = (formData) => {
  const errors = {};

  const name = formData?.name ? formData.name.trim() : "";
  const code = formData?.code ? formData.code.trim().toUpperCase() : "";

  // Class Name
  if (!name) {
    errors.name = "Class name is required";
  } else if (name.length < 2) {
    errors.name = "Class name must be at least 2 characters";
  } else if (name.length > 50) {
    errors.name = "Class name must not exceed 50 characters";
  }

  // Class Code
  if (!code) {
    errors.code = "Class code is required";
  } else if (code.length < 2) {
    errors.code = "Class code must be at least 2 characters";
  } else if (code.length > 20) {
    errors.code = "Class code must not exceed 20 characters";
  }

  return errors;
};
