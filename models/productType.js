// this is a model for product type which will store only types of product

const mongoose = require("mongoose");

const productTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add the name of product type"],
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  // frok and spawn, replica set, gridfs
});

module.exports = new mongoose.model("ProductType", productTypeSchema);
