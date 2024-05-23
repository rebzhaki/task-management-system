import express from "express";
import { config } from "./config";
import { applicationRoutes } from "./routes";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

const startServer = () => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  applicationRoutes(app);
  const server = app.listen(config.PORT, () => {
    console.log(
      `Server is running on: http://localhost:${config.PORT}/v1/api `
    );
  });
  return server;
};

startServer();
