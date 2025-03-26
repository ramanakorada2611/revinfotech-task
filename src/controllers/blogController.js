const Blog = require("../models/Blog");
const { logger } = require("../utils/logger");

exports.createBlog = async (req, res, next) => {
  try {
    // console.log(req.user.user_id);
    const { title, content } = req.body;
    const blog = new Blog({
      title,
      content,
      author: req.user.user_id,
    });
    await blog.save();
    res.status(201).json({
      status: "success",
      message: "The blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.log("error", error);
    // logger.error("Blog creation error:", error);
    next(error);
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments();

    res.json({
      status: "success",
      message: "The all blog data has been fetched successfully",
      count: blogs.length,
      data: blogs,
      // currentPage: page,
      // totalPages: Math.ceil(total / limit),
      // totalBlogs: total,
    });
  } catch (error) {
    logger.error("Blog retrieval error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error retrieving blogs" });
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findOne({
      _id: req.params.id,
      author: req.user.user_id,
    });
    // console.log("blog", blog);

    if (!blog) {
      return res
        .status(404)
        .json({ status: "fail", message: "Blog not found or unauthorized" });
    }

    Object.assign(blog, { title, content });
    await blog.save();
    res.json({
      status: "success",
      message: "The blog has updated",
      data: blog,
    });
  } catch (error) {
    logger.error("Blog update error:", error);
    next(error);
    // res.status(500).json({ message: "Error updating blog" });
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.user.user_id,
    });

    if (!blog) {
      return res
        .status(404)
        .json({ status: "fail", message: "Blog not found or unauthorized" });
    }

    res.json({ status: "success", message: "The blog deleted successfully" });
  } catch (error) {
    logger.error("Blog deletion error:", error);
    next(error);
    // res.status(500).json({ message: "Error deleting blog" });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username"
    );
    // console.log("blog", blog);

    if (!blog) {
      return res
        .status(404)
        .json({ status: "fail", message: "Blog not found" });
    }

    res.json({
      status: "success",
      message: "The user blog data has been fetched successfully",
      data: blog,
    });
  } catch (error) {
    // logger.error("Blog retrieval error:", error);
    console.log(error);
    res.status(500).json({ message: "Error retrieving blog" });
  }
};
