const asyncHandler = require("express-async-handler");
const AppError = require("../ErrorHandlers/AppError");
const ProductType = require("../models/productType");
const Product = require("../models/product");

// creates type of product
const createProductType = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  if (!name) return next(new AppError("Name is not mentioned", 400));

  const exists = await ProductType.findOne({ name });
  if (exists) return next(new AppError("Product type already exists", 400));

  const created = await ProductType.create({
    name,
    user_id: req.user.id,
  });

  if (created) {
    res.status(200).json({
      msg: "Product type successfully created",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

// get all product types
const getAllProductType = asyncHandler(async (req, res, next) => {
  const allProductTypes = await ProductType.find();
  if (allProductTypes) {
    res.status(200).json({
      allProductTypes,
    });
  } else {
    return next(new AppError("Data does not exist", 400));
  }
});

// can delete product type only if there is no product registered on this type
const deleteProductTypeById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id)
    return next(
      new AppError("ID is not present in parameter to delete the product", 400)
    );

  const productType = await ProductType.findOne({ _id: id });
  console.log(productType);
  if (!productType)
    return next(new AppError("Product type does not exist", 400));

  //   if any product exist on this product type, can't delete it
  const existingProduct = await Product.findOne({
    productType: productType._id,
  });
  if (existingProduct) {
    return next(
      new AppError(
        "Can't delete Product Type, A product already exist on this type",
        400
      )
    );
  }

  const done = await ProductType.deleteOne({ name });
  if (done) {
    return res.status(200).json({
      msg: "Product Type successfully deleted",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

// gets all product by product type
const productsByProductType = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  if (!name) return next(new AppError("Product type name field is empty"), 400);

  const productType = await ProductType.findOne({ name });
  if (!productType)
    return next(new AppError("Product type does not exist", 400));

  const allProductsByProductType = await Product.find({
    productType: productType._id,
  });

  if (allProductsByProductType.length == 0) {
    return next(new AppError("No products exists of this product type", 404));
  }

  return res.status(200).json({
    allProductsByProductType,
  });
});

module.exports = {
  createProductType,
  deleteProductTypeById,
  getAllProductType,
  productsByProductType,
};
