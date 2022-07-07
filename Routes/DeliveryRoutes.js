import express from "express";
import asyncHandler from "express-async-handler";
import Delivery from "./../Models/DeliveryModel.js";
import { admin, protect } from "../Middleware/AuthMiddleware.js";

const DeliveryRoute = express.Router();

// GET ALL delivery
DeliveryRoute.get(
  "/all",
  asyncHandler(async (req, res) => {
    const delivery = await Delivery.find({}).sort({ _id: -1 });
    res.json(delivery);
  })
);
  
// GET SINGLE delivery
DeliveryRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const delivery = await Delivery.findById(req.params.id);
    if (delivery) {
      let amount = delivery.amount;
      res.json(amount);
    } else {
      res.status(404);
      throw new Error("country not Found");
    }
  })
);

//GET AMOUNT FROM DELIVERY by country
DeliveryRoute.get(
  "/:country/amount",
  asyncHandler(async (req, res) => {
    const delivery = await Delivery.find({ country: req.params.country});
    if(delivery){
      res.json(delivery)
      
    }else{
      res.status(404);
      throw new Error("country not found")
    }
  })
)
// DELETE country
DeliveryRoute.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const delivery = await Delivery.findById(req.params.id);
    if (delivery) {
      await delivery.remove();
      res.json({ message: "country deleted" });
    } else {
      res.status(404);
      throw new Error("country not Found");
    }
  })
);

// CREATE delivery
DeliveryRoute.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { country, amount } = req.body;
    const CountryExist = await Delivery.findOne({ country });
    if (CountryExist) {
      res.status(400);
      throw new Error("Country name already exist");
    } else {
      const delivery = new Delivery({
        country,
        amount
      });
      if (delivery) {
        const createddelivery = await delivery.save();
        res.status(201).json(createddelivery);
      } else {
        res.status(400);
        throw new Error("Invalid data");
      }
    }
  })
);

// UPDATE delivery
DeliveryRoute.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { country , amount } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    if (delivery) {
      delivery.country = country || delivery.country;
      delivery.amount = amount || delivery.amount;
      
      const updatedDelivery = await delivery.save();
      res.json(updatedDelivery);
    } else {
      res.status(404);
      throw new Error("country not found");
    }
  })
);
export default DeliveryRoute;
