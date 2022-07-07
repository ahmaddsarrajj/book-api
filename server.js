import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import DeliveryRoute from "./Routes/DeliveryRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import logger from "morgan";
import cors from "cors";



dotenv.config({path : './.env'});
connectDatabase();
const app = express();
app.use(express.json());

//cors
app.use(cors(
  {origin : '*'}
));

// API
app.use("/api/delivery", DeliveryRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

//stripe
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/api/stripe-payment", (req, res) => {
  const stripe = require("stripe")(
    ""
  );

  const { amount, email, token } = req.body;

  stripe.customers
    .create({
      email: email,
      source: token.id,
      name: token.card.name,
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: parseFloat(amount) * 100,
        description: `Payment for USD ${amount}`,
        currency: "USD",
        customer: customer.id,
      });
    })
    .then((charge) => res.status(200).send(charge))
    .catch((err) => console.log(err));
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));
