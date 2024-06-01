import { Request, Response } from "express";
import Joi from "joi";
import { User, UserModel } from "../models/user.model";
import { sendUserVerificationEmail } from "../nodemailer";
import { signJwt, verifyJwt } from "../utils/auth";
import {
  UserProfileStatus,
  VerificationTokenType,
} from "../interfaces/user.interface";
import { emailAndPasswordChecker } from "../helpers";
import { Context } from "../utils/context";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, number, password } = req.body;

    // Validations on input
    const joiSchema = Joi.object({
      firstName: Joi.string().required().messages({
        "string.empty": "You have not entered your first name.",
      }),
      lastName: Joi.string().required().messages({
        "string.empty": "You have not entered your first name.",
      }),
      email: Joi.string().required().email().messages({
        "string.empty": "You have not entered your email id.",
        "string.email": "You have entered an invalid email id.",
      }),
      number: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .messages({
          "string.empty": "You have not entered your phone number.",
          "string.length": "You have entered an invalid phone number.",
          "string.pattern": "You have entered an invalid phone number.",
        }),
      password: Joi.string()
        .required()
        .messages({ "string.empty": "You have not entered your password." }),
    });

    // Schema Validation
    const { error } = joiSchema.validate({
      firstName: firstName,
      lastName: lastName,
      email: email,
      number: number,
      password: password,
    });

    if (error) {
      res.status(300).send({
        message: error.message,
        success: false,
      });
      return
    }

    // 1. check if the user already exists

    const user = await UserModel.countDocuments({
      $or: [{ email: email }, { number: number }],
    });

    if (user !== 0) {
      res.status(400).send({
        message: "Looks like user email and number is already in used.",
        success: false,
      });
      return;
    }

    const storeUserInDB = await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      number: number,
      password: password,
      createdAt: new Date(),
    });

    await sendUserVerificationEmail({
      email: email,
      name: firstName + lastName,
      userId: storeUserInDB._id.toString(),
    });

    res.status(201).send({
      message: "User created successfully",
      success: true,
    });
    return
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong",
      success: false,
    });
    return
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;

  const payload = verifyJwt<VerificationTokenType>(token);

  if (!payload) {
    return res.status(400).send({
      message: "Invalid token",
      success: false,
    });
  }

  const user = await UserModel.findById(payload?.id)
    .select("userVerifyStatus")
    .lean();

  if (!user) {
    return res.status(400).send({
      message: "User not found",
      success: false,
    });
  }

  if (user?.userVerifyStatus === UserProfileStatus.completed) {
    return res.status(400).send({
      message: "User already verified",
      success: false,
    });
  }


  try {
    await UserModel.findByIdAndUpdate(payload?.id, {
      userVerifyStatus: UserProfileStatus.completed,
    });


    return res.status(200).send({
      message: "User verified successfully",
      success: true,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message.toString(),
      success: false,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const joiSchema = Joi.object({
      email: Joi.string().required().email().messages({
        "string.empty": "You have not entered your email id.",
        "string.email": "You have entered an invalid email id.",
      }),
      password: Joi.string()
        .required()
        .messages({ "string.empty": "You have not entered your password." }),
    });

    const { error } = joiSchema.validate({
      email: email,
      password: password,
    });

    if (error) {
      res.status(300).send({
        message: error.message,
        success: false,
      });
      return;
    }

    const { status, user } = await emailAndPasswordChecker(email, password);

    if (!status || !user) {
      res.status(400).send({
        message: "Looks like your email or password is incorrect.",
        success: false,
      });
      return;
    }

    if (user?.userVerifyStatus !== UserProfileStatus.completed) {
      res.status(403).send({
        message: "Looks like your email is not yet verified.",
        success: false,
      });
      return
    }

    // create jwt
    const token = signJwt({
      user: user._id,
    });

    // create cookie
    if (process.env.NODE_ENV === "production") {
      res!.cookie("accessToken", token, {
        maxAge: 3.154e10,
        httpOnly: true,
        sameSite: "none",
        secure: true,
        domain: process.env.APP_URI,
        path: "/",
      });
    } else {
      res!.cookie("accessToken", token, {
        maxAge: 3.154e10,
        httpOnly: true,
      });
    }

    res.status(200).send({
      message: "User logged in successfully",
      success: true,
    });
    return
  } catch (error: any) {
    console.log(error);
    res.status(500).send({
      message: error.message.toString(),
      success: false,
    });
    return
  }
};

export const me = async (req: Request, res: Response):Promise<void> => {
  try {

    const user = await UserModel.findById(req?.context?.user)
     .select("firstName lastName email number")
      .lean();
    
    res.status(200).send({
      message: "User found",
      success: true,
      user: user,
    })
    return
    
  } catch (error:any) {
    res.status(300).send({
      message: error.message,
      success: false,
    });
    return
  }
}

export const testController = async (req: Request, res: Response) => {
  try {
    console.log("Test Controller");
    const data = ["India", "Pakistan", "United States"];
    res.status(200).send({
      message: "Test Controller",
      users: data,
    });
  } catch (error: any) {
    res.status(500).send({
      message: error.message.toString(),
    });
  }
};

export const leaderboard = async (req: Request, res: Response) => {
  try {

    console.log(req.cookies.user)

    const users = await UserModel.find()
     .select("firstName lastName email number")
      .lean();
    
    res.status(200).send({
      message: "Leaderboard Controller",
      users: users,
    });
    
  } catch (error:any) {
    res.status(500).send({
      message: error.message.toString(),
    });
  }
  return
}
