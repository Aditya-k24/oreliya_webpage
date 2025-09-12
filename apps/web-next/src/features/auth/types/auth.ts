export type AppUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

export type AppToken = {
  user?: AppUser;
  accessToken?: string;
  refreshToken?: string;
};

export type AppSession = {
  user?: AppUser;
  accessToken?: string;
  refreshToken?: string;
};
