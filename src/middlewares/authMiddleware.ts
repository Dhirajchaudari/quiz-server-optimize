import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/auth";
import { Context, TokenType } from "../utils/context";

declare module "express-serve-static-core" {
  interface Request {
    context?: Context;
  }
}

export const isUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req?.context?.user) {
      res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
      return;
    }
    next();
  } catch (error: any) {
    res.status(error.status).json({
      message: error.message,
    });
    return;
  }
};

export const setContext = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let context: Context = {
      user: undefined,
      req: req,
      res: res,
    };

    if (req?.cookies.accessToken) {
      const user = verifyJwt<TokenType>(req.cookies.accessToken);
      context.user = user?.user;
    }
    // console.log(req?.cookies.accessToken)                                                
    console.log(context?.user)
    req.context = context;
    next();
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
