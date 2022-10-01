import express from "express"
import { addItems, addPromoCart, getCartItems, removeItems } from "../controllers/cart.js";
const router=express.Router()

router.post("/add/items",addItems)
router.post("/getitems",getCartItems)
router.post("/deleteitems",removeItems)
router.post("/addpromocart",addPromoCart)
export default router; 