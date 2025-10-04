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
    const { content, fileName } = req.body;

    // Mock analysis response from Dr. Elena Rodriguez
    const analysis = {
      success: true,
      expert: 'Dr. Elena Rodriguez',
      fileName: fileName || 'uploaded-file',
      analysis: {
        summary: 'Content analysis completed successfully.',
        qualityScore: 85,
        recommendations: [
          'Excellent learning objectives identified',
          'Content structure is well-organized',
          'Consider adding more interactive elements'
        ],
        domains: [
          { name: 'Instructional Design', score: 90 },
          { name: 'Content Quality', score: 85 },
          { name: 'Engagement', score: 80 }
        ],
        gaps: [
          'Assessment strategies could be enhanced',
          'Consider adding multimedia elements'
        ]
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      message: error.message
    });
  }
}
