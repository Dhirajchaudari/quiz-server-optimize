import { UserModel } from "../models/user.model";
import bcrypt from 'bcrypt'

// Check if user exists for given email and password
export const emailAndPasswordChecker = async (
    email: string,
    password: string
  ): Promise<{
    status: boolean;
    user?:{_id: string, userVerifyStatus: string}
  }> => {
    const check = await UserModel.findOne({
      email: { $eq: email },
    })
      .lean()
      .select("_id userVerifyStatus password");
  
    if (!check) {
      return { status: false,user:undefined };
    }
    const checkPass = await bcrypt.compare(password, check.password);
  
    
    return {
      status: checkPass === true,
      user: {
        _id: check._id.toString(),
        userVerifyStatus: check.userVerifyStatus,
      },
    };
  };