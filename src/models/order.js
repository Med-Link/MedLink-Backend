const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },

    amount: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
      // min:10,
      // max:10,
    },

    prescriptionpic: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
