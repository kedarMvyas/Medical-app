// this controller is to add comment on products

const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const AppError = require("../ErrorHandlers/AppError");
const Comment = require("../models/comment");

const comment = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError("Product does not exists", 403));
  }

  const addComment = new Comment({
    user_id: req.user.id,
    product_id: product.id,
    comment: req.body.comment,
  });
  const created = await addComment.save();

  if (created) {
    res.json({
      msg: "Comment Added Successfully",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = comment;
