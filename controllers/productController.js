const asyncHandler = require("express-async-handler");
const AppError = require("../ErrorHandlers/AppError");
const Product = require("../models/product");
const ProductType = require("../models/productType");
const multer = require("multer");

////////////////////////////////////////////////////////////////

const createProduct = asyncHandler(async (req, res, next) => {
  const { name, productType, recommendedDose, price, expiryDate, image } =
    req.body;
  //  user-id: req.user.id
});

////////////////////////////////////////////////////////////////

const updateProduct = asyncHandler(async (req, res, next) => {});

////////////////////////////////////////////////////////////////

const deleteProduct = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const productExists = await Product.findOne({ name });
  if (!productExists) return next(new AppError("Product does not exists", 400));

  const done = await Product.deleteOne({ name });
  if (done) {
    return res.status(200).json({
      msg: "Product have been successfully deleted",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////

const mostRecentProduct = asyncHandler(async (req, res, next) => {
  const recentProduct = await Product.findOne(
    {}, // retrieves all objects as it matches our query
    {}, // retrieves all fields of all products
    { sort: { createdAt: -1 } }
  );
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
  updateProduct,
  deleteProduct,
  getAllProducts,
  mostRecentProduct,
};
