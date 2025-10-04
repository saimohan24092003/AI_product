const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Production backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'https://coursecraft-backend-mohammed-asrafs-projects.vercel.app';

// Enable CORS for backend communication
app.use(cors({
    origin: '*',
    credentials: true
}));

// Middleware to replace backend URLs in HTML and JS files
app.use((req, res, next) => {
    if (req.path.endsWith('.html') || req.path.endsWith('.js')) {
        const filePath = path.join(__dirname, 'public', req.path);

        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Replace all localhost URLs with production backend
            content = content.replace(/http:\/\/localhost:3005/g, BACKEND_URL);
            content = content.replace(/http:\/\/localhost:3000/g, BACKEND_URL);
            content = content.replace(/https:\/\/ai-id-product-2\.vercel\.app/g, BACKEND_URL);

            res.type(req.path.endsWith('.html') ? 'text/html' : 'application/javascript');
            return res.send(content);
        }
    }
    next();
});

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