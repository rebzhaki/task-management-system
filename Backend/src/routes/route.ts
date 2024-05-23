import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { body, param } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares";
import { config } from "../config";
import { nanoid } from "nanoid";

const router = Router();

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
      if (password !== confrimPassword)
        return res
          .status(400)
          .json({ msg: "Password and Confirm Password do not match" });
      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.log(err);

        bcrypt.hash(password, salt, function (err, hash) {
          password = hash;
          //   const newUser = new User({
          //     fullName,
          //     phoneNumber,
          //     email,
          //     password,
          //   });

          //   newUser.save();
          res.status(200).json({
            success: true,
            message: "User successfully registered",
            user: "",
          });
        });
      });
    } catch (error) {
      res.status(400).json({ error: error });
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
  (req: Request, res: Response) => {
    try {
      // User.findOne({
      //   email: req.body.email,
      // }).exec((err, user) => {
      //   var passwordIsValid = bcrypt.compareSync(
      //     req.body.password,
      //     user.password
      //   );
      //   if (!passwordIsValid) {
      //     return res.status(401).send({
      //       accessToken: null,
      //       message: "Invalid Password!",
      //     });
      //   }
      //   let email = req.body.email;
      //   const accessToken = jwt.sign({ email: email }, config.JWT_SECRET_KEY, {
      //     expiresIn: "1h",
      //   });
      //   console.log("userPass", accessToken);
      //   res.status(200).json({
      //     success: true,
      //     token: accessToken,
      //   });
      // });
    } catch (error) {
      res.status(400).json({ error: error });
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
      const {
        task_name: any,
        task_priority,
        due_date,
        task_description,
      } = req.body;
      const authenticationHeader = req.headers["authorization"];
      const token: any =
        authenticationHeader && authenticationHeader.split(" ")[1];
      if (!token)
        res.status(401).json({
          success: "false",
          message: "Denied access, no token provided",
        });
      let decodedData = jwt.verify(
        token,
        config.JWT_SECRET_KEY,
        (err: any, data: any) => {
          if (err)
            res.status(403).json({ success: false, message: "Invalid Token" });
          return data;
        }
      );
      const userId = decodedData;
      //validate user pending

      //generate tracking number
      const trackingNumber = `T-${nanoid(5)}`;
      // const newTask = new Task({
      //   task_name: task_name,
      //   task_priority: task_priority,
      //   due_date: due_date,
      //   task_description: task_description,
      //   trackingNumber: trackingNumber,
      //   task_assigner_id: userId
      // });
      // newTask.save();

      res.status(200).json({
        success: true,
        message: "Task created successfully",
        // data: newTask
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

router.patch(
  "/updateTask:_id",
  [param("_id").notEmpty().withMessage("_id is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const taskId = req.params._id;
    const updatedFields = req.body;
    const authenticationHeader = req.headers["authorization"];
    const token: any =
      authenticationHeader && authenticationHeader.split(" ")[1];
    if (!token)
      res.status(401).json({
        success: "false",
        message: "Denied access, no token provided",
      });
    let decodedData = jwt.verify(
      token,
      config.JWT_SECRET_KEY,
      (err: any, data: any) => {
        if (err)
          res.status(403).json({ success: false, message: "Invalid Token" });
        return data;
      }
    );
    const userId = decodedData;
    //validate user pending

    //validate task id pending

    //get project by id

    //update complainant_id
  }
);
export default router;
