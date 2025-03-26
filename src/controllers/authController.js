const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { logger } = require("../utils/logger");

const generateTokens = (user_id) => {
  // console.log("userrr", user_id);
  const accessToken = jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const refreshToken = jwt.sign(
    { user_id },
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    }
  );

  // console.log({ accessToken, refreshToken });
  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "fail", message: "The user already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      status: "success",
      message: "The user has registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Registration error:", error);
    // console.log("error", error);
    next(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      status: "success",
      message: "The user login has successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Login error:", error);
    next(error);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res
        .status(401)
        .json({ status: "fail", message: "Refresh token required" });
    }

    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    // console.log("decoddd", decoded);
    const user = await User.findById(decoded.user_id);
    // console.log("user", user);

    if (!user || user.refreshToken !== refresh_token) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid refresh token" });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(tokens);
  } catch (error) {
    console.log("error", error);
    // logger.error("Token refresh error:", error);
    res.status(401).json({ status: "error", message: "Invalid refresh token" });
  }
};
