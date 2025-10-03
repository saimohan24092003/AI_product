const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for backend communication
app.use(cors({
    origin: ['http://localhost:3005', 'http://localhost:3000'],
    credentials: true
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from current directory (for HTML files in root)
app.use(express.static(__dirname));

// Handle SPA routing - serve index.html for any route that doesn't match static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export a handler for Vercel (@vercel/node)
module.exports = (req, res) => {
    return app(req, res);
};