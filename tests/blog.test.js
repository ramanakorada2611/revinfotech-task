const request = require("supertest");
const app = require("../src/index");
const Blog = require("../src/models/Blog");

describe("Blog Endpoints", () => {
  let accessToken;
  let userId;

  beforeEach(async () => {
    // Register and login a user before each test
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    accessToken = registerRes.body.accessToken;
    const decoded = require("jsonwebtoken").verify(
      accessToken,
      process.env.JWT_SECRET
    );
    userId = decoded.userId;
  });

  describe("POST /api/blogs", () => {
    it("should create a new blog post", async () => {
      const blogData = {
        title: "Test Blog",
        content: "This is a test blog post",
      };

      const res = await request(app)
        .post("/api/blogs/create-blog")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(blogData);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(blogData.title);
      expect(res.body.content).toBe(blogData.content);
      expect(res.body.author).toBe(userId);
    });

    it("should not create blog without authentication", async () => {
      const res = await request(app).post("/api/blogs").send({
        title: "Test Blog",
        content: "This is a test blog post",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/blogs", () => {
    beforeEach(async () => {
      // Create some test blogs
      const blogs = [
        { title: "Blog 1", content: "Content 1", author: userId },
        { title: "Blog 2", content: "Content 2", author: userId },
        { title: "Blog 3", content: "Content 3", author: userId },
      ];

      await Blog.insertMany(blogs);
    });

    it("should get paginated blogs", async () => {
      const res = await request(app)
        .get("/api/blogs/get-blogs")
        .query({ page: 1, limit: 2 });

      expect(res.status).toBe(200);
      expect(res.body.blogs).toHaveLength(2);
      expect(res.body.totalPages).toBe(2);
      expect(res.body.currentPage).toBe(1);
    });

    it("should get all blogs with default pagination", async () => {
      const res = await request(app).get("/api/blogs");

      expect(res.status).toBe(200);
      expect(res.body.blogs).toHaveLength(3);
    });
  });

  describe("GET /api/blogs/:id", () => {
    let blogId;

    beforeEach(async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        content: "Test Content",
        author: userId,
      });
      blogId = blog._id;
    });

    it("should get a specific blog", async () => {
      const res = await request(app).get(`/api/blogs/get-blog/${blogId}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Test Blog");
      expect(res.body.content).toBe("Test Content");
    });

    it("should return 404 for non-existent blog", async () => {
      const res = await request(app).get("/api/blogs/5f7d3a2e9d5c1b2e3c4d5e6f");

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/blogs/:id", () => {
    let blogId;

    beforeEach(async () => {
      const blog = await Blog.create({
        title: "Original Title",
        content: "Original Content",
        author: userId,
      });
      blogId = blog._id;
    });

    it("should update own blog post", async () => {
      const updateData = {
        title: "Updated Title",
        content: "Updated Content",
      };

      const res = await request(app)
        .put(`/api/blogs/update-blog/${blogId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(updateData.title);
      expect(res.body.content).toBe(updateData.content);
    });

    it("should not update blog without authentication", async () => {
      const res = await request(app).put(`/api/blogs/${blogId}`).send({
        title: "Updated Title",
        content: "Updated Content",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/blogs/:id", () => {
    let blogId;

    beforeEach(async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        content: "Test Content",
        author: userId,
      });
      blogId = blog._id;
    });

    it("should delete own blog post", async () => {
      const res = await request(app)
        .delete(`/api/blogs/delete-blog/${blogId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Blog deleted successfully");

      const blog = await Blog.findById(blogId);
      expect(blog).toBeNull();
    });

    it("should not delete blog without authentication", async () => {
      const res = await request(app).delete(`/api/blogs/${blogId}`);

      expect(res.status).toBe(401);
    });
  });
});
