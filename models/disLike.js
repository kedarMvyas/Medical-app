const mongoose = require("mongoose");

const disLikeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = new mongoose.model("DisLike", disLikeSchema);
