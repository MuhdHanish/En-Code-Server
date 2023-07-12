import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { userModel } from "../../../framework/database/models/userModel";
import { userRepositoryEmpl } from "../../../framework/repository/userRepository";
import { userLogin } from "../../../app/usecases/common/userLogin";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwtTokenUtils";
import mongoose from "mongoose";

const userRepository = userRepositoryEmpl(userModel);

 const loginController = async (req: Request, res: Response) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password,role } = req.body;
  const user = await userLogin(userRepository)(email, password);
  if (user) {
  const accessToken = await generateAccessToken(user?._id as mongoose.Types.ObjectId, user?.role as string);
   const refreshToken = await generateRefreshToken(user?._id as mongoose.Types.ObjectId, user?.role as string);
   res.cookie(`${role}JWT`, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 100 * 24 * 60 * 60 * 1000
   });
  return res.status(201).json({ message: "Login successfull", user, accessToken });
  }else{
   return res.status(401).json({message: "No active account found with the given credentials"})
  }
 } catch (error) {
  return res.status(500).json({ message: "Internal server error" });
 }
}

export default loginController;