import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: any = validationResult(req);

  if (!errors.isEmpty()) {
    let message = errors
      .array()
      .map((err: any) => err.msg)
      .toString();
    return res.status(400).json({ error: message });
  }
  next();
};

export const blacklist = new Set();

export const checkBlacklist = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (blacklist.has(token)) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }
  next();
};
