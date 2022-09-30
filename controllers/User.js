import User from "../models/Usermodel.js";
import Product from "../models/ProductModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Storetoken } from "../utils/jwt.js";
import cloudinary from "cloudinary";
// Register user
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, avatar } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      const mycloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      user = await User({
        name,
        email,
        password,
        avatar: {
          public_id: mycloud.public_id,
          url: mycloud.secure_url,
        },
      });
      user.password = await bcryptjs.hash(user.password, 10);
      user.save();
      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      return Storetoken(user, token, 200, res);
    }
    res.status(200).json({
      success: false,
      message: "user  already exist",
    });
  } catch (error) {}
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!req.cookies.token) {
    if (email || password) {
      const user = await User.findOne({ email: email }).select("+password");
      if (!user) {
        return res.status(200).json({
          success: false,
          message: "email or password is wrong",
        });
      }
      const ispasswordmatched = await bcryptjs.compare(password, user.password);
      if (ispasswordmatched) {
        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return Storetoken(user, token, 200, res);
      }
      return res.status(200).json({
        success: false,
        message: "email or password is wrong",
      });
    }
  }
  res.status(401).json({
    message: "you are already looged in user",
  });
};

// Logout user
export const logOut = (req, res) => {
  if (!req.cookies.token) {
    return res.status(401).json({
      message: "please login to logout",
    });
  }
  res.clearCookie("token");
  res.status(200).json({
    message: "you are looged out",
  });
};

//change password
export const changePassword = async (req, res) => {
  const { token } = req.body;
  if (token) {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const finduser = await User.findById(data.id).select("+password");
    if (finduser) {
      let checkpassword = await bcryptjs.compare(
        req.body.oldpassword,
        finduser.password
      );
      if (checkpassword) {
        let hashedpassword = await bcryptjs.hash(req.body.newpassword, 10);
        finduser.password = hashedpassword;
        finduser.save();
        return res.status(200).json({
          success: true,
          message: "password change successfully",
          user: finduser,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "password is not correct",
        });
      }
    }
  }
  res.status(401).json({
    message: "your password is not valid",
  });
};



//get user details
export const getuserdetails = async (req, res) => {
  if (req.body.token) {
    const data = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const user = await User.findById(data.id);
    return res.status(200).json({
      success: true,
      user,
    });
  } else {
    res.status(200).json({
      success: false,
      message: "please login",
    });
  }
};

// update user profile
export const updateprofile = async (req, res) => {
  const data = jwt.verify(req.body.token, process.env.JWT_SECRET);
  console.log(data.id);
  if (data.id) {
    const updateuserdata = {
      name: req.body.name,
      email: req.body.email,
    };
    if (req.body.avatar) {
      let finduser = await User.findById(data.id);
      const imageid = finduser.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imageid);
      const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
      });
      updateuserdata.avatar = {
        public_id: mycloud.public_id,
        url: mycloud.url,
      };
    }
    const user = await User.findByIdAndUpdate(data.id, updateuserdata, {
      new: true,
    });
    res.status(200).json({
      success: true,
      user,
    });
  } else {
    res.status(200).json({
      success: false,
      message: "please login and get token",
    });
  }
};

//get all users (admin)
export const getallusers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
};

// get single user (admin)
export const getsingleuser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User doesnot exist with this id",
    });
  }
  res.status(200).json({
    success: true,
    user,
  });
};

// update user  (Admin)
export const updateUser = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });
  user.save();
  res.status(200).json({
    success: true,
    user,
    message: "user is successfully updated",
  });
};

// Delete user (Admin)
export const deleteuser = async (req, res) => {
  const data = jwt.verify(req.params.token, process.env.JWT_SECRET);
  const user = await User.findById(req.params.id);
  const me = await User.findById(data.id);
  const products = await Product.find();
  if (user._id.toString() !== me._id.toString()) {
    products.forEach((product) => {
      product.reviews.forEach((review) => {
        if (review.user.toString() === user._id.toString()) {
          product.reviews = product.reviews.filter(
            (myreview) => myreview.user.toString() !== user._id.toString()
          );
        }
      });
      product.save();
    });
    await user.remove();
    res.status(200).json({
      success: true,
      message: "user deleted",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "admin cant delete its profile",
    });
  }
};