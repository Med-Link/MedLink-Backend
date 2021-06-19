const mongoose = require('mongoose');

const { Schema } = mongoose;

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
    prescriptionName: {
      type: String,
    },
    prescriptionUrl: {
      type: String,
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

    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', OrderSchema);
