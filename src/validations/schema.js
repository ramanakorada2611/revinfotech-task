const Joi = require("joi");

// Define the validation schema
const updateBlogShema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title must be less than or equal to 200 characters",
  }),
  content: Joi.string().min(10).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content must be at least 10 characters",
  }),
});

// Export the function
module.exports = { updateBlogShema };
