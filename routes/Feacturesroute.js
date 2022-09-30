import express from "express"
import { Filter, Search, sortingByprice } from "../controllers/Feactures.js";
const router=express.Router();

router.route("/product").get(Search)
router.route("/product/filter").post(Filter)
router.route("/product/sortPrice/:filter/:category").get(sortingByprice)

export default router;

