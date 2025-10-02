const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5173;

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

app.listen(PORT, () => {
    console.log(`🌐 Frontend server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
    console.log(`🔗 Backend connection: http://localhost:3005`);
});