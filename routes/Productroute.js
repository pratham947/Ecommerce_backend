import express from "express";
import {
  addimage,
  CreateProduct,
  createproductreview,
  deleteimage,
  Deleteproduct,
  deletereview,
  deleteReviewAdmin,
  getallimage,
  Getallproduct,
  getProductByCategory,
  getProductreview,
  getsingleproduct,
  UpdateProduct,
} from "../controllers/Product.js";
import { checkAdmin } from "../utils/Admin.js";
const router = express.Router();

router.route("/admin/product/createproduct").post(checkAdmin, CreateProduct);
router.route("/product/getallproduct").get(Getallproduct);
router.route("/product/category").post(getProductByCategory);
router.route("/product/:id").get(getsingleproduct);
router
  .route("/admin/product/updateproduct/:id")
  .post(checkAdmin, UpdateProduct);
router
  .route("/admin/product/deleteproduct/:id")
  .post(checkAdmin, Deleteproduct);
router.route("/product/review/create").put(createproductreview);
router.route("/product/review/getreview").post(getProductreview);
router
  .route("/product/review/delete/:productid/:reviewId")
  .delete(deletereview);
// delete review admin 
router.route("/product/review/Admin/deletereview").post(deleteReviewAdmin)  
// get all image 
router.route("/product/image/getallimage/:productId").get(getallimage)
router.route("/admin/product/addimages/:id").post(checkAdmin, addimage);
router.route("/admin/product/deleteimage/:id").post(checkAdmin, deleteimage);
export default router;

