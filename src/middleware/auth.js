const jwt = require("jsonwebtoken");
const { logger } = require("../utils/logger");
const { updateBlogShema } = require("../validations/schema");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ status: "fail", message: "Please provide token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({ status: "error", message: "Invalid token" });
  }
};

module.exports = auth;
