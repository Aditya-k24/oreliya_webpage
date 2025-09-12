export const config = {
  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};
