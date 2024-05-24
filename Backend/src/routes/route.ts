import express, { Router, Request, Response, Express } from "express";
import bcrypt from "bcrypt";
import { body, param } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares";
import { config } from "../config";
import { nanoid } from "nanoid";
import {
  checkIfUserExists,
  getSingleUser,
  getTaskById,
  getUserById,
  saveNewTask,
  saveNewUser,
  setTaskComplainant,
} from "../controllers";
import { DatabaseConnection } from "./app";

const router = Router();
const app: Express = express();
const connection = DatabaseConnection();

//auth routes
router.post(
  "/register",
  [
    body("fullName").notEmpty().withMessage("Full Name is required"),
    body("phoneNumber").notEmpty().withMessage("Phone Number is required"),
    body("email").isEmail().withMessage("Email Address is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("confrimPassword").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      let { fullName, phoneNumber, email, password, confrimPassword } =
        req.body;
      let user = await checkIfUserExists(connection, email);

      if (user === null) {
        res.status(400).json({ success: false, message: "User aleady exists" });
      } else {
        if (password !== confrimPassword)
          return res.status(400).json({
            success: false,
            message: "Password and Confirm Password do not match",
          });
        bcrypt.genSalt(10, (err, salt) => {
          if (err) console.log(err);

          bcrypt.hash(password, salt, async function (err, hash) {
            password = hash;
            const newUser = {
              fullName,
              phoneNumber,
              email,
              password,
            };
            await saveNewUser(connection, newUser);
            res.status(200).json({
              success: true,
              message: "User successfully registered",
            });
          });
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);

router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email Address is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await getSingleUser(connection, email);
      let pass = await user
        .map((data: any) => {
          return data["password"];
        })
        .join(",");

      if (user === null) {
        res.status(400).json({ status: false, message: "User Not Found" });
      } else {
        let passwordIsValid = bcrypt.compareSync(password, pass);
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }
        const accessToken = jwt.sign({ email: email }, config.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });
        res.status(200).json({
          success: true,
          message: "Successfully Logged in",
          data: accessToken,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);

//tasks routes
router.post(
  "/createNewTask",
  [
    body("task_name").notEmpty().withMessage("Task name is required"),
    body("task_priority").notEmpty().withMessage("Task Priority is required"),
    body("due_date").notEmpty().withMessage("Due Date is required"),
    body("task_description")
      .notEmpty()
      .withMessage("Task Description is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      // check authenticated user
      const { task_name, task_priority, due_date, task_description } = req.body;
      const authenticationHeader = req.headers["authorization"];
      const token: any =
        authenticationHeader && authenticationHeader.split(" ")[1];
      if (!token)
        res.status(401).json({
          success: "false",
          message: "Denied access, no token provided",
        });
      let decodedData: any = jwt.verify(
        token,
        config.JWT_SECRET_KEY,
        (err: any, data: any) => {
          if (err)
            res.status(403).json({ success: false, message: "Invalid Token" });
          return data;
        }
      );
      const userEmail = decodedData["email"];
      const user = await getSingleUser(connection, userEmail);
      let userId = user.map((data: any) => data["id"]).join(",");

      //generate tracking number
      const trackingNumber = `T-${nanoid(5)}`;
      const newTask = {
        task_name: task_name,
        task_priority: task_priority,
        due_date: due_date,
        task_description: task_description,
        tracking_number: trackingNumber,
        task_assigner_id: userId,
      };
      await saveNewTask(connection, newTask);

      res.status(200).json({
        success: true,
        message: "Task created successfully",
        data: newTask,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);

router.patch(
  "/updateTaskComplainant/:_id",
  [param("_id").notEmpty().withMessage("_id is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const taskId = req.params._id;
      const { complainant_id } = req.body;

      const authenticationHeader = req.headers["authorization"];
      const token: any =
        authenticationHeader && authenticationHeader.split(" ")[1];
      if (!token)
        res.status(401).json({
          success: "false",
          message: "Denied access, no token provided",
        });

      let decodedData: any = jwt.verify(
        token,
        config.JWT_SECRET_KEY,
        (err: any, data: any) => {
          if (err)
            res.status(403).json({ success: false, message: "Invalid Token" });
          return data;
        }
      );

      const user = await getUserById(connection, complainant_id);
      let userData = user.map((data: any) => {
        return { phoneNumber: data["phoneNumber"], name: data["fullName"] };
      });

      //get project by id
      let task = await getTaskById(connection, taskId);
      if (task === null) {
        res
          .status(403)
          .json({ success: false, message: "Task does not exist" });
      } else {
        const TrackingNumber = task
          .map((data: any) => data["tracking_number"])
          .join(",");
        const data = {
          complainant: userData,
          TrackingNumber: TrackingNumber,
        };
        console.log("data", data);

        await setTaskComplainant(connection, complainant_id, taskId);

        res.status(200).json({
          success: true,
          message: "Complainant assigned successfully",
          data: data,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);
export default router;
