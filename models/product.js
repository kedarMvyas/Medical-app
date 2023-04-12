// expiry date of medical product
// create Medical product(With file upload, product image should be only image allow)

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    productType: {
      type: mongoose.Schema.ObjectId,
      ref: "ProductType",
    },
    recommendedDose: {
      type: String,
    },
    price: {
      type: Number,
    },
    expiryDate: {
      type: Date,
    },
    image: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Product", productSchema);
