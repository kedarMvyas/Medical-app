const asyncHandler = require("express-async-handler");
const AppError = require("../ErrorHandlers/AppError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../config/nodemailer");
const crypto = require("crypto");
const User = require("../models/user");

////////////////////////////////////////////////////////////////
// generates a random token for forgot password functionality
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
// hashes the same token for reset password functionality
const hashToken = (token) => {
  const sha256 = crypto.createHash("sha256");
  sha256.update(token);
  return sha256.digest("hex");
};

// generates a jwtoken
const JWTokenGenerator = async (user) => {
  const accessToken = await jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
  return accessToken;
};

//////////////////////////////////////////////////////////////////////////

// register a user
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // sending email as registered successfully

    const message = `Hey ${user.name}, \n You have successfully registered in our Medical App :) \n  Thanks a lot xD for registering into our application`;

    try {
      await sendEmail({
        email: user.email,
        subject: "You have successfully registered into Medical Application",
        message,
      });

      return res.status(200).json({
        msg: "User successfully created",
        _id: user._id,
        email,
      });
    } catch (err) {
      return next(new AppError({ err }, 500));
    }
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

//////////////////////////////////////////////////////////////////////////

// login user with assigning a jwtoken
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Email is not registered yet", 400));
  }

  const passCompare = await bcrypt.compare(password, user.password);

  if (passCompare) {
    const accessToken = await JWTokenGenerator(user);

    return res.status(200).json({
      msg: "You have successfully logged in :) ",
      accessToken,
    });
  } else {
    return next(new AppError("Password is incorrect", 401));
  }
});

//////////////////////////////////////////////////////////////////////////

// deletes user only if same user is logged in
const deleteUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Email is not registered yet", 400));
  }

  if (req.user.email !== email)
    return next(new AppError("Can't delete another user", 400));

  const passCompare = await bcrypt.compare(password, user.password);

  if (passCompare) {
    const temp = await User.deleteOne(user);
    if (temp) {
      res.status(200).json({
        msg: "User deleted successfully",
        accessToken: "",
      });
    }
  }
});

//////////////////////////////////////////////////////////////////////////

// sends a email with a token for authentication to change password
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });

  const resetToken = generateToken();
  const tokenDB = hashToken(resetToken);
  await user.updateOne({
    passwordResetToken: tokenDB,
  });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/users/resetPassword/${resetToken}`;

  const message = `Hey ${user.name}, \n Forgot your password? Don't Worry :) \n Submit a PATCH request with your new password to: ${resetURL} \n If you didn't forget your password, please ignore this email ! `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token is only valid for 10 mins!",
      message,
    });

    res.status(200).json({
      message: "Forgot Password Token sent to email!",
      token: resetToken,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError({ err }, 500));
  }
});

//////////////////////////////////////////////////////////////////////////

// checks forgotpassword token and then resets password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm) {
    return next(
      new AppError("Both password & passwordConfirm fields are neccessary")
    );
  }
  if (password !== passwordConfirm) {
    return next(
      new AppError("Password and password fields are not the same", 400)
    );
  }

  const token = req.params.token;
  if (token == "null") {
    return next(
      new AppError("Token not present, click forgot password again", 403)
    );
  }

  const hashedToken = hashToken(token);
  const user = await User.findOne({ passwordResetToken: hashedToken });
  if (!user) {
    return next(new AppError("User not found", 400));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  const created = await user.save();
  if (created) {
    res.status(200).json({
      msg: "Password successfully changed",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

//////////////////////////////////////////////////////////////////////////

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  forgotPassword,
  resetPassword,
};
