import jwt from "jsonwebtoken";
import User from "../models/Usermodel.js";
export const checkAdmin = async (req, res, next) => {
  const data = await jwt.verify(
    req.body.token ? req.body.token : req.params.token,
    process.env.JWT_SECRET
  );
  const findAdmin=await User.findById(data.id)
  if (findAdmin.role === "Admin") {
    next();
  } else {
    res.status(200).json({ 
      success: false,
      message: "you are not authorized for  creating products",
    });
  }
};
