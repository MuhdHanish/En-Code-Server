import { Request, Response, NextFunction } from "express";
import { cache } from "../utils/otpSendAndStore";

const resetPasswordVerify = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { enteredOtp } = req.body;
    const value = cache.get(id);
    if (!value) {
      return res.status(401).json({ message: "Un-Authorized request" });
    } else {
      if (parseInt(enteredOtp) === value) {
        cache.del(id);
        return res.status(200).json({ message: "Otp is verified, reset password" });
      } else {
        return res.status(400).json({ message: "Given Otp is invalid" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default resetPasswordVerify;
