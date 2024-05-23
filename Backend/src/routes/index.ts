import express, { Express } from "express";
import cors from "cors";
import router from "./route";
import { DatabaseConnection } from "./app";

const app = express();
app.use(cors());
DatabaseConnection(app);

export const applicationRoutes = (app: Express) => {
  app.use("/v1/api", router);
};
