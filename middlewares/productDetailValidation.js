// this middleware is to check all the details are completely filled
// by the user in order to store data into database perfectly

const asyncHandler = require("express-async-handler");
const AppError = require("../ErrorHandlers/AppError");

const productDetailValidation = asyncHandler(async (req, res, next) => {
  const { name, productType, recommendedDose, price, expiryDate } = req.body;

  let missingValues = [];

  if (!name) missingValues.push("Name ");
  if (!productType) missingValues.push("ProductType ");
  if (!recommendedDose) missingValues.push("RecommendedDose ");
  if (!price) missingValues.push("Price ");
  if (!expiryDate) missingValues.push("ExpiryDate ");

  if (missingValues.length > 0) {
    return next(
      new AppError(
        `required missing values : ${missingValues} is neccessary to be filled`,
        400
      )
    );
  }
  // 2024-04-11T00:00:00.000+00:00
  const temp = expiryDate.split("T")[0];
  const date = temp.split("-");
  if (
    date.length !== 3 ||
    date.some(isNaN) ||
    date[0].length !== 4 ||
    date[1].length !== 2 ||
    date[2].length !== 2
  ) {
    return next(new AppError("Expiry date must be in YYYY-MM-DD format", 400));
  }

  next();
});

module.exports = productDetailValidation;
