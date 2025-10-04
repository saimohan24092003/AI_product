export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'CourseCraft AI Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}
