import express from "express";
import {
  addOrder,
  changeOrderStatus,
  CheckDetails,
  Checkuser,
  deleteOrder,
  deleteOrderAdmin,
  getAllOrders,
  getOrder,
  getSingleOrder,
  updateShipping,
} from "../controllers/order.js";
import { checkAdmin } from "../utils/Admin.js";
const router = express.Router();

router.post("/shippingInfo", CheckDetails);
router.post("/checkuser", Checkuser);
router.post("/addorder", addOrder);
router.post("/getorders", getOrder);
router.post("/getsingleorder", getSingleOrder);
router.post("/deleteorder", deleteOrder);
router.post("/deleteorderadmin", deleteOrderAdmin);
router.post("/updateshipping", updateShipping);
router.get("/getallorders/:token", checkAdmin, getAllOrders);
// change order status Admin
router.post("/admin/order/updatestatus",checkAdmin,changeOrderStatus)

export default router;
