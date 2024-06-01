import { Request, Response } from "express";

export interface Context {
  req?: Request;
  res?: Response;
  user: string | undefined;  // user: User._id
}

export interface TokenType {
  user: string;
}

export interface CustomRequest extends Request {
  context: Context;
}
