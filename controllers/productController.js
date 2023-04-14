const asyncHandler = require("express-async-handler");
const AppError = require("../ErrorHandlers/AppError");
const Product = require("../models/product");
const ProductType = require("../models/productType");
const Like = require("../models/like");
const Dislike = require("../models/disLike");
const Comment = require("../models/comment");

////////////////////////////////////////////////////////////////

// creates product with image upload and other data
const createProduct = asyncHandler(async (req, res, next) => {
  const { name, productType, recommendedDose, price, expiryDate } = req.body;
  let typeID;
  let userImage;
  const imageFiles = req.files["image"];

  const productExists = await Product.find({ name, user_id: req.user.id });
  if (productExists.length > 0)
    return next(new AppError("Product Already Exists"));

  const typeExists = await ProductType.findOne({ name: productType });
  if (!typeExists) {
    return next(new AppError("This product type does not exists", 400));
  } else {
    typeID = typeExists._id;
  }

  if (imageFiles) {
    userImage = imageFiles.map((file) => file.filename);
  } else {
    userImage = undefined;
  }

  const created = await Product.create({
    user_id: req.user.id,
    name,
    productType: typeID,
    recommendedDose,
    price,
    expiryDate,
    image: userImage,
  });
  if (created) {
    return res.status(200).json({
      name,
      productType,
      msg: "Product created successfully",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

////////////////////////////////////////////////////////////////

// can update data with an id in parameter
const updateProductById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let typeID;
  const file = req.files;
  const { name, recommendedDose, price, productType, expiryDate } = req.body;
  if (!id) return next(new AppError("Product Id is not present", 400));

  const productExists = await Product.findById(id);
  if (!productExists) return next(new AppError("Product does not exist", 400));

  if (productExists.user_id.toString() !== req.user.id)
    return next(new AppError("User don't have access to update product", 401));

  const typeExists = await ProductType.findOne({ name: productType });
  if (!typeExists) {
    return next(new AppError("This product type does not exists", 400));
  } else {
    typeID = typeExists._id;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      name,
      productType: typeID,
      recommendedDose,
      price,
      expiryDate,
      image: file.filename,
    },
    {
      new: true,
    }
  );

  if (updatedProduct) {
    return res.status(200).json({
      name,
      productType,
      msg: "Product updated successfully",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

////////////////////////////////////////////////////////////////

// delete product with id in a parameter
const deleteProductById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new AppError("id is not present in the parameter"));

  const productExists = await Product.findById(id);
  if (!productExists) return next(new AppError("Product does not exists", 400));

  if (productExists.user_id.toString() !== req.user.id) {
    return next(new AppError("User don't have access to delete product", 401));
  }

  const done = await Product.deleteOne(productExists);
  if (done) {
    const allLikes = await Like.find({ product_id: productExists._id });
    await Like.deleteMany(allLikes);

    const allDislikes = await Dislike.find({ product_id: productExists._id });
    await Dislike.deleteMany(allDislikes);

    const allComments = await Comment.find({ product_id: productExists._id });
    await Comment.deleteMany(allComments);

    return res.status(200).json({
      msg: "Product have been successfully deleted",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

////////////////////////////////////////////////////////////////

// gets all products
const getAllProducts = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find();
  if (allProducts) {
    return res.status(200).json({
      allProducts,
    });
  } else {
    return next(new AppError("No product exists", 204));
  }
});

/**
 * gets most recently registered product
 * also have a query option to limit resource shown
 */

const mostRecentProduct = asyncHandler(async (req, res, next) => {
  const query = req.query.limit || 1;
  if (isNaN(query)) return next(new AppError("Query must be a Number"));

  const recentProduct = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(+query);
  // .populate({
  //   path: "likes",
  //   select: "user_id",
  //   populate: { path: "user_id", select: "name" },
  // })
  // .populate({
  //   path: "dislikes",
  //   select: "user_id",
  //   populate: { path: "user_id", select: "name" },
  // })
  // .populate({
  //   path: "comments",
  //   select: "user_id comment",
  //   populate: { path: "user_id", select: "name" },
  // });


  if (recentProduct) {
    return res.status(200).json({
      recentProduct,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

////////////////////////////////////////////////////////////////

module.exports = {
  createProduct,
  updateProductById,
  deleteProductById,
  getAllProducts,
  mostRecentProduct,
};
