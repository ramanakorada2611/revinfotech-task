const express = require("express");
const auth = require("../middleware/auth");
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { validateUpdateBlog } = require("../validations");

const router = express.Router();

router.post("/create-blog", [auth, validateUpdateBlog], createBlog);
router.get("/get-blogs", auth, getBlogs);
router.get("/get-blog/:id", auth, getBlog);
router.put("/update-blog/:id", [auth, validateUpdateBlog], updateBlog);
router.delete("/delete-blog/:id", auth, deleteBlog);

module.exports = router;
