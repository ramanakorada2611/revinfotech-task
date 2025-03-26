const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
blogSchema.index({ createdAt: -1 });
blogSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model("Blog", blogSchema);
