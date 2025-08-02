import Blog from "../models/blog.module.js";
import User from "../models/user.module.js";

// CREATE - Create a new blog
const createBlog = async (request, response) => {
  try {
    const { title, description } = request.body;
    const authorId = request.user._id; // From auth middleware

    // Validation
    if (!title) {
      return response.status(400).json({
        status: false,
        message: "Title is required"
      });
    }

    if (!description) {
      return response.status(400).json({
        status: false,
        message: "Description is required"
      });
    }

    if (title.length > 200) {
      return response.status(400).json({
        status: false,
        message: "Title must be less than 200 characters"
      });
    }

    // Create new blog
    const newBlog = new Blog({
      title,
      description,
      author: authorId
    });

    const savedBlog = await newBlog.save();

    // Populate author details
    await savedBlog.populate('author', 'name email username');

    response.status(201).json({
      status: true,
      message: "Blog created successfully",
      data: savedBlog
    });

  } catch (error) {
    console.error("Create blog error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// READ - Get all blogs
const getAllBlogs = async (request, response) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email username')
      .sort({ createdAt: -1 });

    response.status(200).json({
      status: true,
      message: "Blogs retrieved successfully",
      data: blogs
    });

  } catch (error) {
    console.error("Get all blogs error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// READ - Get blog by ID
const getBlogById = async (request, response) => {
  try {
    const { id } = request.params;

    const blog = await Blog.findById(id)
      .populate('author', 'name email username');

    if (!blog) {
      return response.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    response.status(200).json({
      status: true,
      message: "Blog retrieved successfully",
      data: blog
    });

  } catch (error) {
    console.error("Get blog by ID error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// READ - Get blogs by author
const getBlogsByAuthor = async (request, response) => {
  try {
    const { authorId } = request.params;

    const blogs = await Blog.find({ author: authorId })
      .populate('author', 'name email username')
      .sort({ createdAt: -1 });

    response.status(200).json({
      status: true,
      message: "Blogs retrieved successfully",
      data: blogs
    });

  } catch (error) {
    console.error("Get blogs by author error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// UPDATE - Update blog
const updateBlog = async (request, response) => {
  try {
    const { id } = request.params;
    const { title, description } = request.body;
    const userId = request.user._id;

    // Find blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== userId.toString()) {
      return response.status(403).json({
        status: false,
        message: "You can only update your own blogs"
      });
    }

    // Validation
    if (title && title.length > 200) {
      return response.status(400).json({
        status: false,
        message: "Title must be less than 200 characters"
      });
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    ).populate('author', 'name email username');

    response.status(200).json({
      status: true,
      message: "Blog updated successfully",
      data: updatedBlog
    });

  } catch (error) {
    console.error("Update blog error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// DELETE - Delete blog
const deleteBlog = async (request, response) => {
  try {
    const { id } = request.params;
    const userId = request.user._id;

    // Find blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== userId.toString()) {
      return response.status(403).json({
        status: false,
        message: "You can only delete your own blogs"
      });
    }

    // Delete blog
    await Blog.findByIdAndDelete(id);

    response.status(200).json({
      status: true,
      message: "Blog deleted successfully"
    });

  } catch (error) {
    console.error("Delete blog error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// VOTE - Upvote blog
const upvoteBlog = async (request, response) => {
  try {
    const { id } = request.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    // Increment upvotes
    blog.upvotes += 1;
    await blog.save();

    response.status(200).json({
      status: true,
      message: "Blog upvoted successfully",
      data: blog
    });

  } catch (error) {
    console.error("Upvote blog error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// VOTE - Downvote blog
const downvoteBlog = async (request, response) => {
  try {
    const { id } = request.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    // Increment downvotes
    blog.downvotes += 1;
    await blog.save();

    response.status(200).json({
      status: true,
      message: "Blog downvoted successfully",
      data: blog
    });

  } catch (error) {
    console.error("Downvote blog error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

export {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByAuthor,
  updateBlog,
  deleteBlog,
  upvoteBlog,
  downvoteBlog
}; 