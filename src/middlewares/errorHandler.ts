import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err.stack);
      res.status(400).json({ message: "Something broke!" });
    }
  } catch (error) {
    console.error(err.stack);
    res.status(400).json({ message: "Something broke!" });
  } finally {
    next();
  }
};

export default errorHandler;
