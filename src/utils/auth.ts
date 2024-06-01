import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


// 1. generate public & private keys

// 2. convert public & private key to base64 format

const publicKey = Buffer.from(process.env.PUBLIC_KEY!, "base64").toString(
    "ascii"
  );
  const privateKey = Buffer.from(process.env.PRIVATE_KEY!, "base64").toString(
    "ascii"
  );
  

  export function jwtValid(token: string): boolean {
      let isValid: boolean = false;
    jwt.verify(token, publicKey, (error, decode) => {
      if (error?.name === "TokenExpiredError") {
        isValid = true;
      } else {
        isValid = false;
      }
    });
    return isValid;
}
  
export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(object, privateKey, {
      ...(options && options),
      algorithm: "RS256",
    });
}
  
export function verifyJwt<T>(token: string): T | null {
    try {
      const decoded = jwt.verify(token, publicKey) as T;
      return decoded;
    } catch (error) {
      return null;
    }
  }