import express from "express"
import { addItems, getCartItems, removeItems } from "../controllers/cart.js";
const router=express.Router()

router.post("/add/items",addItems)
router.post("/getitems",getCartItems)
router.post("/deleteitems",removeItems)
export default router;