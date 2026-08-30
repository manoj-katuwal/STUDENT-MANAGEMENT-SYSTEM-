let accessToken = null;

export const authStore = {
  getAccessToken: () => accessToken,

  setAccessToken: (token) => {
    accessToken = token;
  },

  clearAccessToken: () => {
    accessToken = null;
  },
};
