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
});

module.exports = new mongoose.model("ProductType", productTypeSchema);
