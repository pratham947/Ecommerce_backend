import jwt from "jsonwebtoken"
import User from "../models/Usermodel.js"
export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({
            message: "Please Login to access the resource"
        })
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(data.id).select("+password")
    next();
}
