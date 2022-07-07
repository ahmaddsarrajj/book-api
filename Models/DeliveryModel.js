import mongoose from "mongoose";

const deliverySchema = mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      unique: true
    },
    
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model("delivery", deliverySchema);

export default Delivery;
