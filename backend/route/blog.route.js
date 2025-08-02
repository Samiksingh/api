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
  downvoteBlog,
  addComment,
  updateComment,
  deleteComment,
  voteComment,
  getBlogsByTag
} from "../controller/blog.controller.js";

const router = express.Router();



// All routes are now protected with authentication
router.get("/", isAuth, getAllBlogs);
router.get("/:id", isAuth, getBlogById);
router.get("/author/:authorId", isAuth, getBlogsByAuthor);
router.get("/tag/:tag", isAuth, getBlogsByTag);

// Protected routes (authentication required)
router.post("/", isAuth, createBlog);
router.put("/:id", isAuth, updateBlog);
router.delete("/:id", isAuth, deleteBlog);

// Voting routes (authentication required)
router.post("/:id/upvote", isAuth, upvoteBlog);
router.post("/:id/downvote", isAuth, downvoteBlog);

// Comment routes (authentication required)
router.post("/:id/comments", isAuth, addComment);
router.put("/:blogId/comments/:commentId", isAuth, updateComment);
router.delete("/:blogId/comments/:commentId", isAuth, deleteComment);
router.post("/:blogId/comments/:commentId/vote", isAuth, voteComment);

export default router; 