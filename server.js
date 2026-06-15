require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const Post = require("./models/Post");
const User = require("./models/User");

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Custom logger middleware
app.use((req, res, next) => {
    console.log(
        `[${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`
    );
    next();
});

// Home Route
app.get("/", (req, res) => {
    res.json({
message: "Welcome to The Data Hub API"
    });
});

// Create User
app.post("/users", async (req, res) => {
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get All Users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();

        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get Top 3 Recent Posts
app.get("/posts/recent", async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(3);

        res.json(posts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get All Posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find().populate("authorId");

        res.json(posts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Create Post
app.post("/posts", async (req, res) => {
    try {
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            authorId: req.body.authorId
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Delete Post
app.delete("/posts/:id", async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});