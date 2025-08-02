import Blog from "../models/blog.module.js";
import User from "../models/user.module.js";

// CREATE - Create a new blog
const createBlog = async (request, response) => {
  try {
    const { title, description, tags } = request.body;
    const authorId = request.user._id;

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

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return response.status(400).json({
        status: false,
        message: "At least one tag is required"
      });
    }

    if (title.length > 200) {
      return response.status(400).json({
        status: false,
        message: "Title must be less than 200 characters"
      });
    }

    const validTags = ["sports", "nature", "traveling", "technology", "food", "lifestyle", "education", "entertainment"];
    const invalidTags = tags.filter(tag => !validTags.includes(tag));
    if (invalidTags.length > 0) {
      return response.status(400).json({
        status: false,
        message: `Invalid tags: ${invalidTags.join(', ')}. Valid tags are: ${validTags.join(', ')}`
      });
    }

    const newBlog = new Blog({
      title,
      description,
      tags,
      author: authorId
    });

    const savedBlog = await newBlog.save();

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
      .populate('comments.author', 'name email username')
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
      .populate('author', 'name email username')
      .populate('comments.author', 'name email username');

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
      .populate('comments.author', 'name email username')
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
    const { title, description, tags } = request.body;
    const userId = request.user._id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    if (blog.author.toString() !== userId.toString()) {
      return response.status(403).json({
        status: false,
        message: "You can only update your own blogs"
      });
    }

    if (title && title.length > 200) {
      return response.status(400).json({
        status: false,
        message: "Title must be less than 200 characters"
      });
    }

    if (tags) {
      if (!Array.isArray(tags) || tags.length === 0) {
        return response.status(400).json({
          status: false,
          message: "At least one tag is required"
        });
      }

      const validTags = ["sports", "nature", "traveling", "technology", "food", "lifestyle", "education", "entertainment"];
      const invalidTags = tags.filter(tag => !validTags.includes(tag));
      if (invalidTags.length > 0) {
        return response.status(400).json({
          status: false,
          message: `Invalid tags: ${invalidTags.join(', ')}. Valid tags are: ${validTags.join(', ')}`
        });
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, description, tags },
      { new: true, runValidators: true }
    ).populate('author', 'name email username')
     .populate('comments.author', 'name email username');

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

    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    if (blog.author.toString() !== userId.toString()) {
      return response.status(403).json({
        status: false,
        message: "You can only delete your own blogs"
      });
    }

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

// COMMENT - Add comment to blog
const addComment = async (request, response) => {
  try {
    const { id } = request.params;
    const { comment } = request.body;
    const userId = request.user._id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    if (!comment) {
      return response.status(400).json({
        status: false,
        message: "Comment is required"
      });
    }

    if (comment.length > 1000) {
      return response.status(400).json({
        status: false,
        message: "Comment must be less than 1000 characters"
      });
    }

    blog.comments.push({
      author: userId,
      content : comment
    });

    await blog.save();

    const updatedBlog = await Blog.findById(id)
      .populate('author', 'name email username')
      .populate('comments.author', 'name email username');

    response.status(201).json({
      status: true,
      message: "Comment added successfully",
      data: updatedBlog
    });

  } catch (error) {
    console.error("Add comment error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// COMMENT - Update comment
const updateComment = async (request, response) => {
  try {
    const { blogId, commentId } = request.params;
    const { content } = request.body;
    const userId = request.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return response.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return response.status(404).json({
        status: false,
        message: "Comment not found"
      });
    }

    if (comment.author.toString() !== userId.toString()) {
      return response.status(403).json({
        status: false,
        message: "You can only update your own comments"
      });
    }

    if (!content) {
      return response.status(400).json({
        status: false,
        message: "Comment content is required"
      });
    }

    if (content.length > 1000) {
      return response.status(400).json({
        status: false,
        message: "Comment must be less than 1000 characters"
      });
    }

    comment.content = content;
    await blog.save();

    const updatedBlog = await Blog.findById(blogId)
      .populate('author', 'name email username')
      .populate('comments.author', 'name email username');

    response.status(200).json({
      status: true,
      message: "Comment updated successfully",
      data: updatedBlog
    });

  } catch (error) {
    console.error("Update comment error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// COMMENT - Delete comment
const deleteComment = async (request, response) => {
  try {
    const { blogId, commentId } = request.params;
    const userId = request.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return response.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return response.status(404).json({
        status: false,
        message: "Comment not found"
      });
    }

    if (comment.author.toString() !== userId.toString()) {
      return response.status(403).json({
        status: false,
        message: "You can only delete your own comments"
      });
    }

    comment.remove();
    await blog.save();

    const updatedBlog = await Blog.findById(blogId)
      .populate('author', 'name email username')
      .populate('comments.author', 'name email username');

    response.status(200).json({
      status: true,
      message: "Comment deleted successfully",
      data: updatedBlog
    });

  } catch (error) {
    console.error("Delete comment error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// COMMENT - Vote on comment
const voteComment = async (request, response) => {
  try {
    const { blogId, commentId } = request.params;
    const { voteType } = request.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return response.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return response.status(404).json({
        status: false,
        message: "Comment not found"
      });
    }

    if (voteType === 'upvote') {
      comment.upvotes += 1;
    } else if (voteType === 'downvote') {
      comment.downvotes += 1;
    } else {
      return response.status(400).json({
        status: false,
        message: "Vote type must be 'upvote' or 'downvote'"
      });
    }

    await blog.save();


    const updatedBlog = await Blog.findById(blogId)
      .populate('author', 'name email username')
      .populate('comments.author', 'name email username');

    response.status(200).json({
      status: true,
      message: `Comment ${voteType}d successfully`,
      data: updatedBlog
    });

  } catch (error) {
    console.error("Vote comment error:", error);
    response.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// BLOG - Get blogs by tag
const getBlogsByTag = async (request, response) => {
  try {
    const { tag } = request.params;

    const validTags = ["sports", "nature", "traveling", "technology", "food", "lifestyle", "education", "entertainment"];
    if (!validTags.includes(tag)) {
      return response.status(400).json({
        status: false,
        message: `Invalid tag. Valid tags are: ${validTags.join(', ')}`
      });
    }

    const blogs = await Blog.find({ tags: tag })
      .populate('author', 'name email username')
      .populate('comments.author', 'name email username')
      .sort({ createdAt: -1 });

    response.status(200).json({
      status: true,
      message: `Blogs with tag '${tag}' retrieved successfully`,
      data: blogs
    });

  } catch (error) {
    console.error("Get blogs by tag error:", error);
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
  downvoteBlog,
  addComment,
  updateComment,
  deleteComment,
  voteComment,
  getBlogsByTag
}; 