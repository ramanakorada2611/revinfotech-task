const { updateBlogShema } = require("./schema");

const errorMessage = (value, res, next) => {
  //   console.log(value, "value");
  if (value.error) {
    return res.status(400).json({
      success: false,
      message: value.error.details[0].message,
    });
  } else {
    next();
  }
};

const validateUpdateBlog = (req, res, next) => {
  const value = updateBlogShema.validate(req.body);
  errorMessage(value, res, next);
};

module.exports = { validateUpdateBlog };
