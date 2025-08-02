import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tags: [{
        type: String,
        enum: ["sports", "nature", "traveling", "technology", "food", "lifestyle", "education", "entertainment"],
        required: true
    }],
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog; 