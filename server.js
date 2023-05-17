const express = require("express");
const dbConnect = require("./config/dbConnect");
const globalErrorHandler = require("./ErrorHandlers/globalErrorHandler");
const mongoSanitize = require("express-mongo-sanitize");
const AppError = require("./ErrorHandlers/AppError");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(mongoSanitize()); // used for NOSQL query injection attacks
app.use(cors());

dbConnect();

//////////////////////////////////////////////////////////// implementing sms send ///////////////////////////////////////////////////////////////
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require("twilio")(accountSid, authToken);
// client.messages
//   .create({
//     body: "Hello from Twilio",
//     from: process.env.TWILIO_FROM_NUMBER,
//     to: process.env.TWILIO_TO_NUMBER,
//   })
//   .then((message) => console.log(message.sid));

//////////////////////////////////////////////////////// implementing, voice call (try) ///////////////////////////////////////////////////////////////
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require("twilio")(accountSid, authToken);

// client.calls
//   .create({
//     twiml: "<Response><Say>Ahoy, Basanti Madarchod haii!</Say></Response>",
//     to: process.env.TWILIO_TO_NUMBER,
//     from: process.env.TWILIO_FROM_NUMBER,
//   })
//   .then((call) => console.log(call.sid));

app.use("/users", userRoute);
app.use("/products", productRoute);

app.all("*", (req, res, next) => {
  return next(
    new AppError("This route is not yet defined in this application", 400)
  );
});
app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`);
});

// functionalities newly added (punit sir)

// like dislike
// query validation
// new route getUser
// image not compulsory
// alternative of "fields" (upload photo)
// delete user's like dislike and comment on products when deleting user/product
// add likes, dislikes and comments in getMostRecentProduct & getAllProducts route
