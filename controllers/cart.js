import jwt from "jsonwebtoken";
import Cart from "../models/cartmodel.js";


export const addItems = async (req, res) => {
  const { token, product, quantity } = req.body;
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const findingCart = await Cart.findOne({ user: data.id });
  const productobj = {
    productId: product._id,
    url: product.image[0].url,
    name: product.name,
    quantity,
    producttotal: quantity * product.price,
    stock: product.stock,
    actualPrice: product.price,
  };
  if (findingCart) {
    const find = findingCart.Products.findIndex(
      (items) => items.productId.toString() === product._id.toString()
    );
    if (find >= 0) {
      if (findingCart.Products[find].quantity !== quantity) {
        findingCart.Products[find].quantity = quantity;
        findingCart.save();
        return res.status(200).json({
          success: true,
          message: "quantity changed",
          items: findingCart.Products,
        });
      }
      return res.status(200).json({
        success: false,
        message: "items is already added in the cart",
      });
    } else {
      findingCart.Products.push(productobj);
      let carttotal=0;
      findingCart.Products.forEach((product)=>{
        carttotal=carttotal + product.producttotal
      })
      findingCart.carttotal=carttotal
      findingCart.save(); 
      res.status(200).json({
        success: true,
        findingCart,
        message: "items is successfully added in the cart",
      });
    }
  } else {
    const createCart = await Cart({
      user: data.id,
      Products: [productobj],
    });
    createCart.save();
    res.status(200).json({
      success: true,
      createCart,
      message: "items is successfully added in the cart",
    });
  }
};

export const removeItems = async (req, res) => {
  const { token, productId } = req.body;
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const user = await Cart.findOne({ user: data.id });
  if (user) {
    const findIndex = user.Products.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    if (findIndex >= 0) {
      user.Products.splice(findIndex, 1);
      let carttotal=0;
      user.Products.forEach((product)=>{
        carttotal=carttotal + product.producttotal
      })
      user.carttotal=carttotal
      user.save();
      res.status(200).json({
        success: true,
        items: user.Products,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No Item found",
      });
    }
  }
};

export const getCartItems = async (req, res) => {
  const { token } = req.body;
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const items = await Cart.findOne({ user: data.id });
  if (items) {
    return res.status(200).json({
      success: true,
      items: items,
    });
  }
  else{
    res.status(200).json({
      success:false,
      message:"nothing found in the cart"
    })
  }
};


export const addPromoCart=async(req,res)=>{
  const { token,cartprice } = req.body;
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const items = await Cart.findOne({ user: data.id });
  items.carttotal=cartprice;
  items.save();
  res.status(200).json({
    success:true,
    newprice:items.carttotal
  })
}