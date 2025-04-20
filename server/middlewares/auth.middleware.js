import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import dotenv from "dotenv";
dotenv.config();

// Auth
export const authenticationMiddleware = async (req, res, next) => {
  try {
    //extract token
    const { userToken } =
      req.cookies ||
      req.body.userToken ||
      req.header("Authorization").replace("Bearer ", "");
    // if token not available
    if (!userToken)
      return res.status(409).json({
        success: false,
        message: "userToken not found",
        error: "userToken not found",
      });
    //verify userToken
    try {
      const decodedData = await jwt.verify(userToken, process.env.SECRET_KEY);
      const { _id, accountType } = decodedData;
      req.user = { userId: _id, accountType };
    } catch (error) {
      console.log(
        "Error in decodingjwt in authenticationMiddleware ----> ",
        error.message
      );
      return res.status(401).json({
        success: false,
        message: "Invalid jwt token",
        error: "Invalid jwt token",
      });
    }

    next();
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in authenticationMiddleware function in auth.middleware.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Internal Server Error",
      error: "Internal Server Error",
    });
  }
};

// isStudent

export const isStudentMiddleware = async (req, res, next) => {
  try {
    const { userId, accountType } = req.user;
    if (accountType !== "Student") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized to access students routes",
          error: "Unauthorized to access students routes",
        });
    }
    next();
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in isStudentMiddleware function in auth.middleware.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Internal Server Error, Can't find accountType",
      error: "Internal Server Error",
    });
  }
};

// isInstructor

export const isInstructorMiddleware = async (req, res, next) => {
  try {
    const { userId, accountType } = req.user;
    if (accountType !== "Instructor") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized to access Instructor routes",
          error: "Unauthorized to access Instructor routes",
        });
    }
    next();
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in isInstructorMiddleware function in auth.middleware.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Internal Server Error, Can't find accountType",
      error: "Internal Server Error",
    });
  }
};

// isAdmin

export const isAdminMiddleware = async (req, res, next) => {
  try {
    const { userId, accountType } = req.user;
    if (accountType !== "Admin") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized to access Admin routes",
          error: "Unauthorized to access Admin routes",
        });
    }
    next();
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in isAdminMiddleware function in auth.middleware.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Internal Server Error, Can't find accountType",
      error: "Internal Server Error",
    });
  }
};
