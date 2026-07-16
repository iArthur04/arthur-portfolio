// server.js - Updated with GitHub token
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// GitHub API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'iArthur04';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// ========================================
// GITHUB API PROXY ROUTES (WITH AUTH)
// ========================================

// Get user data
app.get('/api/github/user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        console.log(`🔄 Fetching GitHub user: ${username}`);
        
        const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                'Authorization': GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : '',
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Arthur-Portfolio/1.0'
            }
        });
        
        if (!response.ok) {
            console.error(`❌ GitHub API error: ${response.status}`);
            if (response.status === 403) {
                return res.status(403).json({ 
                    error: 'Rate limited! Add a GitHub token to increase your limits.',
                    rate_limited: true 
                });
            }
            return res.status(response.status).json({ error: 'User not found' });
        }
        
        const data = await response.json();
        console.log(`✅ User data fetched: ${data.login}`);
        res.json(data);
    } catch (error) {
        console.error('❌ GitHub API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user repos
app.get('/api/github/repos/:username', async (req, res) => {
    try {
        const { username } = req.params;
        console.log(`🔄 Fetching repos for: ${username}`);
        
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
            {
                headers: {
                    'Authorization': GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : '',
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Arthur-Portfolio/1.0'
                }
            }
        );
        
        if (!response.ok) {
            console.error(`❌ Repos fetch error: ${response.status}`);
            return res.status(response.status).json({ error: 'Repos not found' });
        }
        
        const data = await response.json();
        console.log(`✅ ${data.length} repos fetched`);
        res.json(data);
    } catch (error) {
        console.error('❌ GitHub Repos Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get contribution data
app.get('/api/github/contributions/:username', async (req, res) => {
    try {
        const { username } = req.params;
        console.log(`🔄 Fetching contributions for: ${username}`);
        
        // Using a free contribution API service
        const response = await fetch(
            `https://github-contributions-api.jogruber.com/v4/${username}?y=2024`
        );
        
        if (!response.ok) {
            console.log('⚠️ Contribution API failed, using mock data');
            return res.json(generateMockContributions());
        }
        
        const data = await response.json();
        console.log(`✅ Contributions data received`);
        res.json(data);
    } catch (error) {
        console.error('❌ Contributions API Error:', error);
        res.json(generateMockContributions());
    }
});

// Generate mock contribution data (fallback)
function generateMockContributions() {
    const data = {};
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 365);

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayOfWeek = d.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const baseCount = isWeekend ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 10);
        data[dateStr] = Math.random() > 0.3 ? baseCount : 0;
    }
    return data;
}

// Quotes route
app.get('/api/quotes', (req, res) => {
    const quotes = [
        { text: "The best way to predict the future is to build it.", author: "Alan Kay" },
        { text: "Every expert was once a beginner.", author: "Unknown" },
        { text: "Code is poetry in motion.", author: "Arthur" },
        { text: "AI is the new electricity.", author: "Andrew Ng" },
        { text: "Your limitation—it's only your imagination.", author: "Unknown" },
        { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
        { text: "Great things never come from comfort zones.", author: "Unknown" },
        { text: "Dream big. Work hard. Stay focused.", author: "Unknown" }
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🔑 GitHub Token: ${GITHUB_TOKEN ? '✅ Configured' : '❌ Not configured (rate limited)'}`);
});