import Order from "../models/orderModel.js";
import jwt from "jsonwebtoken";
import Cart from "../models/cartmodel.js";

export const Checkuser = async (req, res) => {
  const { token } = req.body;
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const user = await Order.findOne({ user: data.id });
  if (user) {
    return res.status(200).json({
      success: true,
      shippingInfo: user.shippingInfo,
    });
  } else {
    res.status(200).json({
      success: false,
    });
  }
};

export const CheckDetails = async (req, res) => {
  const { token, informationObj } = req.body;
  const { adress, city, country, pinCode, state, Name, phoneNo } =
    informationObj;
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const findUser = await Order.findOne({ user: data.id });
  if (findUser) {
    return res.status(200).json({
      success: false,
      message: "user information already exist",
    });
  } else {
    let shippingInfo = {
      adress,
      city,
      country,
      pinCode,
      phoneNo,
      state,
    };
    const user = await Order({
      shippingInfo,
      user: data.id,
      Name,
    });
    user.save();
    res.status(200).json({
      success: true,
      user,
    });
  }
};

export const addOrder = async (req, res) => {
  const { items, token } = req.body;
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const user = await Order.findOne({ user: data.id });
  try {
    if (user) {
      items.map((item) => {
        item.user = data.id;
        user.orderedItems.unshift(item);
      });
      const cartorder = await Cart.findOne({ user: data.id });
      cartorder.Products = [];
      cartorder.save();
      user.save();
      return res.status(200).json({
        success: true,
        user,
        cartorder,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getOrder = async (req, res) => {
  const { token } = req.body;
  if (token) {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const orders = await Order.findOne({ user: data.id });
    if (orders) {
      return res.status(200).json({
        success: true,
        orders,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No orders found",
      });
    }
  }
};

export const getSingleOrder = async (req, res) => {
  const { orderId, token } = req.body;
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const user = await Order.findOne({ user: data.id });
  if (user) {
    let order = user.orderedItems.find(
      (order) => order._id.toString() === orderId.toString()
    );
    res.status(200).json({
      success: true,
      order,
    });
  }
};

export const deleteOrder = async (req, res) => {
  const { token, productId } = req.body;
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const orders = await Order.findOne({ user: data.id });
  const findOrderIndex = orders.orderedItems.findIndex(
    (order) => order._id.toString() === productId.toString()
  );
  if (findOrderIndex >= 0) {
    orders.orderedItems.splice(findOrderIndex, 1);
    orders.save();
    res.status(200).json({
      success: true,
      orders,
    });
  } else {
    res.status(200).json({
      success: false,
    });
  }
};

// delete order admin
export const deleteOrderAdmin = async (req, res) => {
  const { id, orderId } = req.body;
  const orders = await Order.findById(id);
  const orderIndex = orders.orderedItems.findIndex(
    (order) => order._id.toString() === orderId.toString()
  );
  orders.orderedItems.splice(orderIndex, 1);
  orders.save();
  res.status(200).json({
    success: true,
    message: "order is deleted successfully please reload the page",
    orders,
  });
};

export const updateShipping = async (req, res) => {
  const { token } = req.body;
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const finduser = await Order.findOne({ user: data.id });
  finduser.shippingInfo = req.body;
  finduser.save();
  res.status(200).json({
    success: true,
    message: "shipping information is updated successfully",
    finduser,
  });
};

export const getAllOrders = async (req, res) => {
  const data = await Order.find();
  res.status(200).json({
    success: true,
    data,
  });
};

// change order status
export const changeOrderStatus = async (req, res) => {
  const { myorder, status } = req.body;
  const findOrder = await Order.findOne({ user: myorder.user });
  const index = findOrder.orderedItems.findIndex(
    (order) => order._id.toString() === myorder._id.toString()
  );
  if (index >= 0) {
    const time = new Date();
    findOrder.orderedItems[index].status = status;
    findOrder.orderedItems[index].statustime = time.getTime();
  }
  findOrder.save();
  res.status(200).json({
    success: true,
    findOrder,
    message: "order status changed",
  });
};
