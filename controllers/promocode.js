import AppliedPromos from "../models/AppliedPromoModel.js";
import Promocode from "../models/promocodemodel.js";
import jwt from "jsonwebtoken";
export const promoCode = async (req, res) => {
  const findPromoExist = await Promocode.findOne({
    promocode: req.body.promocode,
  });
  if (findPromoExist) {
    res.status(200).json({
      success: false,
      message: "promo code already exist",
    });
  } else {
    const Createpromo = await Promocode(req.body);
    try {
      if (Createpromo) {
        Createpromo.save();
        res.status(200).json({
          success: true,
          Createpromo,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

// Admin route
export const getAllPromo = async (req, res) => {
  const promos = await Promocode.find();
  res.status(200).json({
    success: true,
    promos,
  });
};

export const deletePromo = async (req, res) => {
  const deleted = await Promocode.findOne({ _id: req.params.id });
  if (deleted) {
    await deleted.remove();
    res.status(200).json({
      success: true,
      message: "promocode deleted successfully",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "promocode not exist",
    });
  }
};

export const updatePromos = async (req, res) => {
  const findPromo = await Promocode.findById(req.body.id);
  if (findPromo) {
    if(req.body.discount){
      findPromo.discount=req.body.discount
    }
    if(req.body.status){
      findPromo.expired=req.body.status
    }
    findPromo.save();
    res.status(200).json({
      success: false,
      message: "promocode is successfully updated",
      findPromo,
    });
  }
};
const comparePromos = (appliedCodes, code) => {
  let Exist=0;
  appliedCodes.appliedPromos.forEach((codes) => {
    if(codes.code===code){
      Exist=1;
    }
  })
  if(Exist==1){
    return true
  }
  else{
    return false
  }
};

export const validatePromoCode = async (req, res) => {
  const { code, token } = req.body;
  const checkCodeExist = await Promocode.findOne({ promocode: code });
  if (checkCodeExist) {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const appliedCodes = await AppliedPromos.findOne({ user: data.id });
    if (appliedCodes) {
      const checkcodes = await comparePromos(appliedCodes, code); 
      if (checkcodes == false) {
        if (checkCodeExist.expired === false) {
          appliedCodes.appliedPromos.push({code});
          appliedCodes.save();
          return res.status(200).json({
            success: true,
            message: "promocode is successfully applied",
            promocode:checkCodeExist
          });
        } else {
          return res.status(200).json({
            success: false,
            message: "promocode is expired",
          });
        }
      }
       else {
        return res.status(200).json({
          success: false,
          message: "promocode is already applied",
        });
      }
    }
     else {
      const createAppliedPromo = await AppliedPromos({
        user: data.id,
        appliedPromos: [
          {
            code,
          },
        ],
      });
      createAppliedPromo.save();
      res.status(200).json({
        success: true,
        message: "promocode is successfully applied",
        code: checkCodeExist,
      });
    }
  }
   else {
    res.status(200).json({
      success: false,
      message: "not a valid code",
    });
  }
}
