import { db } from "../db/index.js";
import { UserTable } from "../models/users.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { removeUnusedMulterImageFilesOnError } from "../utils/helpers.js";

/**
 * @param {Error | ApiError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @description This middleware is responsible for catching errors from any request handler wrapped inside {@link asyncHandler}
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Check if the error is an instance of ApiError
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof Error ? 400 : 500;

    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Ensure that the error is an instance of ApiError class
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  removeUnusedMulterImageFilesOnError(req);

  // Send error response
  return res.status(error.statusCode).json(response);
};

export { errorHandler };
