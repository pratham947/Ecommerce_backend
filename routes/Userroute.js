import express from "express";
import {
  changePassword,
  deleteuser,
  getallusers,
  getsingleuser,
  getuserdetails,
  loginUser,
  logOut,
  registerUser,
  updateprofile,
  updateUser,
} from "../controllers/User.js";
import { checkAdmin } from "../utils/Admin.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOut);
router.route("/changepassword").put(changePassword); 
router.route("/me").post(getuserdetails);
router.route("/profile/me/update").put(updateprofile);
router.route("/getallusers").get(getallusers);
router.route("/profile/:id").get(getsingleuser);
router.route("/admin/updateuser").post(checkAdmin, updateUser);
router.route("/admin/user/:id/:token").delete(deleteuser);
export default router;
