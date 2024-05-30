import { Express, NextFunction, Response } from "express";
import { config } from "../config";
import { Connection, Request } from "tedious";

export const configs: any = {
  server: config.SERVER,
  authentication: {
    type: "default",
    options: {
      userName: config.SERVER_USERNAME,
      password: config.SERVER_PASSWORD,
    },
  },
  options: {
    database: config.DATABASE,
    encrypt: true,
    port: 1433,
  },
};

export const DatabaseConnection = () => {
  const connection = new Connection(configs);

  connection.on("connect", async (err) => {
    if (err) {
      console.log("Error connecting to the database", err);
    }
    console.log("Successfully connected to the database 🔥");
  });

  connection.on("error", (err) => {
    console.error("Database connection error:", err);
  });

  connection.connect();
  return connection;
};
