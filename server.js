// server.js - Simple Express server for your portfolio
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API route for GitHub stats (proxy to avoid CORS issues)
app.get('/api/github/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API route for AI quotes (placeholder - we'll add real AI later)
app.get('/api/quote', (req, res) => {
    const quotes = [
        "The best way to predict the future is to build it.",
        "Every expert was once a beginner.",
        "Code is poetry in motion.",
        "AI is the new electricity.",
        "Your limitation—it's only your imagination."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ quote: randomQuote, author: "AI Arthur" });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
});