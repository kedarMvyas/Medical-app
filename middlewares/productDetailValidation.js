const asyncHandler = require("express-async-handler");
const AppError = require("../ErrorHandlers/AppError");
const ProductType = require("../models/productType");

const productDetailValidation = asyncHandler(async (req, res, next) => {
  const { name, productType, price, expiryDate, image } = req.body;

  let missingValues = [];

  if (!name) missingValues.push("Name ");
  if (!productType) missingValues.push("ProductType ");
  if (!price) missingValues.push("Price ");
  if (!expiryDate) missingValues.push("ExpiryDate ");
  if (!image) missingValues.push("Image ");

  if (missingValues.length > 0) {
    return next(
      new AppError(
        `required missing values :${missingValues} is neccessary to be filled`,
        400
      )
    );
  }

  const date = expiryDate.split("-");
  if (
    date.length !== 3 ||
    date.some(isNaN) ||
    date[0].length !== 4 ||
    date[1].length !== 2 ||
    date[2].length !== 2
  ) {
    return next(new AppError("Expiry date must be in YYYY-MM-DD format", 400));
  }

  const typeExists = await ProductType.findOne({ name });
  if (!typeExists)
    return next(new AppError("Product type does not exist", 400));
});

module.exports = productDetailValidation;
