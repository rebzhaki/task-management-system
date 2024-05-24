import express, { Express } from "express";
import cors from "cors";
import router from "./route";

const app = express();
app.use(cors());

export const applicationRoutes = (app: Express) => {
  app.use("/v1/api", router);
};
