import express from "express"
import { deletePromo, getAllPromo, promoCode, updatePromos, validatePromoCode } from "../controllers/promocode.js";
const router=express.Router();


router.post("/createcode",promoCode)
router.post("/updatecodes",updatePromos)
router.post("/validatepromo",validatePromoCode)
router.get("/getcodes",getAllPromo)  
router.get(`/deletepromo/:id`,deletePromo)

export default router;
