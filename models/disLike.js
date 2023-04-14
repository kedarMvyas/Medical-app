// this is a dislike model which will store all the data of user's dislikes

const mongoose = require("mongoose");

const disLikeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = new mongoose.model("DisLike", disLikeSchema);
