// Helper function to set CORS headers
function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  const allowedOrigins = process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(',')
    : ['https://coursecraft-frontend-mohammed-asrafs-projects.vercel.app'];

  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  setCorsHeaders(req, res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For now, return success with mock data
    // Real file processing would happen here
    res.status(200).json({
      success: true,
      message: 'File received successfully',
      analysis: {
        status: 'analyzing',
        message: 'Dr. Elena Rodriguez is analyzing your content...'
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'File upload failed',
      message: error.message
    });
  }
}
