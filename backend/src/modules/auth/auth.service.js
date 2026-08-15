import { registerUser } from "../users/user.service.js";

export const register = async (userData) => {
  const user = await registerUser(userData);

  return user;
};
