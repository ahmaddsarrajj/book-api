import express from "express";
import asyncHandler from "express-async-handler";
import { admin, protect } from "../Middleware/AuthMiddleware.js";
import Order from "./../Models/OrderModel.js";

const orderRouter = express.Router();

// CREATE ORDER
orderRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      customer,
      shippingAddress,
      paymentMethod,
      totalPrice
    } = req.body;
 
    
    
      const order = new Order({
        customer,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });

      const createOrder = await order.save();
      res.status(201).json(createOrder);
    }
  )
);

// ADMIN GET ALL ORDERS
orderRouter.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({})
      .sort({ _id: -1 })
      //.populate("user", "id name email");
    res.json(orders);
  })
);

// ORDER IS DELIVERED
orderRouter.put(
  "/:id/delivered",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

// ORDER IS PAID
orderRouter.put(
  "/:id/paid",
  
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);



//update order info
orderRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { 
       customer,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
     } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.customer = customer || order.customer;
      order.shippingAddress = shippingAddress || order.shippingAddress;
      order.paymentMethod = paymentMethod || order.paymentMethod;
      order.itemsPrice = itemsPrice || order.itemsPrice;
      order.shippingPrice = shippingAddress || order.shippingAddress;
      order.shippingPrice = shippingPrice || order.shippingPrice;
      order.totalPrice = totalPrice || order.totalPrice;
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("order not found");
    }
  })
);


//GET DELIVERY.COUNTRY FROM DELIVERY LEFT JOIN ORDER ON DELIVERY.COUNTRY = ORDER.COUNTRY;
orderRouter.get(
  "/getcountry",
  asyncHandler(async (req, res) => {
    const orders = await Order.aggregate({
      $lookup:
          {
              from: "Delivery",
              localField: "country",
              foreignField : "country",
              as: "country"
          }
      })
    res.json(orders);
  })
);  
export default orderRouter;
