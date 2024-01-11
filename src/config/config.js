import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO,
  HASH: process.env.HASH,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  GIT_APP_ID: process.env.GIT_APP_ID,
  GIT_CLIENT_ID: process.env.GIT_CLIENT_ID,
  GIT_CLIENT_SECRET: process.env.GIT_CLIENT_SECRET,
  GIT_CALLBACK_URL: process.env.GIT_CALLBACK_URL,
};

export default config;
