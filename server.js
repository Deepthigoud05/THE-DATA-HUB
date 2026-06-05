const express = require("express");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// In-memory database
let blogPosts = [];

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

// GET all posts
app.get("/posts", (req, res) => {
    res.json(blogPosts);
});

// GET post by ID
app.get("/posts/:id", (req, res) => {
    const id = Number(req.params.id);

    const post = blogPosts.find(post => post.id === id);

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    res.json(post);
});

// CREATE post
app.post("/posts", (req, res) => {
    const newPost = {
        id: Date.now(),
        title: req.body.title,
        author: req.body.author
    };

    blogPosts.push(newPost);

    res.status(201).json({
        message: "Post created successfully",
        data: newPost
    });
});

// UPDATE post
app.put("/posts/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = blogPosts.findIndex(post => post.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    blogPosts[index] = {
        ...blogPosts[index],
        ...req.body
    };

    res.json({
        message: "Post updated successfully",
        data: blogPosts[index]
    });
});

// DELETE post
app.delete("/posts/:id", (req, res) => {
    const id = Number(req.params.id);

    const postExists = blogPosts.find(post => post.id === id);

    if (!postExists) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    blogPosts = blogPosts.filter(post => post.id !== id);

    res.json({
        message: "Post deleted successfully"
    });
});

// LOGIN route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    res.json({
        message: "Login successful",
        token: "mock-jwt-token-123456789",
        username
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});