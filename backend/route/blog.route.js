import express from "express";
import isAuth from "../middleware/auth.js";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByAuthor,
  updateBlog,
  deleteBlog,
  upvoteBlog,
  downvoteBlog
} from "../controller/blog.controller.js";

const router = express.Router();



// All routes are now protected with authentication
router.get("/", isAuth, getAllBlogs);
router.get("/:id", isAuth, getBlogById);
router.get("/author/:authorId", isAuth, getBlogsByAuthor);

// Protected routes (authentication required)
router.post("/", isAuth, createBlog);
router.put("/:id", isAuth, updateBlog);
router.delete("/:id", isAuth, deleteBlog);

// Voting routes (authentication required)
router.post("/:id/upvote", isAuth, upvoteBlog);
router.post("/:id/downvote", isAuth, downvoteBlog);

export default router; 