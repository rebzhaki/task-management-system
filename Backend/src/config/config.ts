import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: 8000,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "default_secret_key",
  SERVER: process.env.SERVER,
  SERVER_USERNAME: process.env.SERVER_USERNAME,
  SERVER_PASSWORD: process.env.SERVER_PASSWORD,
  DATABASE: process.env.DATABASE,
};
