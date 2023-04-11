// expiry date of medical product
// create Medical product(With file upload, product image should be only image allow)

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add the product name"],
      unique: [true, "This Product already exists"],
    },
    productType: {
      type: mongoose.Schema.ObjectId,
      ref: "ProductType",
      required: [true, "Please add the product type"],
    },
    recommendedDose: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Please add the Price of product"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Please add the expiry date"],
    },
    image: {
      type: String,
      required: [true, "Please add the image of product"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Product", productSchema);
