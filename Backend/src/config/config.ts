import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: 8000,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "default_secret_key",
};
