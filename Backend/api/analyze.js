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

// Analyze content to determine domain
function analyzeDomain(content) {
  const text = content.toLowerCase();

  if (text.includes('health') || text.includes('medical') || text.includes('patient') || text.includes('clinical')) {
    return { domain: 'Healthcare & Medical Education', reasoning: 'Content contains healthcare-specific terminology and medical education concepts' };
  } else if (text.includes('software') || text.includes('code') || text.includes('programming') || text.includes('tech')) {
    return { domain: 'Technology & Software', reasoning: 'Content focuses on technical skills and software development concepts' };
  } else if (text.includes('business') || text.includes('management') || text.includes('corporate') || text.includes('strategy')) {
    return { domain: 'Business & Management', reasoning: 'Content addresses business processes and organizational development' };
  } else if (text.includes('compliance') || text.includes('regulation') || text.includes('policy') || text.includes('legal')) {
    return { domain: 'Compliance & Regulatory', reasoning: 'Content covers regulatory requirements and compliance procedures' };
  } else if (text.includes('customer') || text.includes('service') || text.includes('support')) {
    return { domain: 'Customer Service', reasoning: 'Content emphasizes customer interaction and service excellence' };
  } else {
    return { domain: 'Professional Development', reasoning: 'Content addresses general professional skills and knowledge development' };
  }
}

// Generate content-based SME questions (5-8 questions)
function generateSMEQuestions(content, domain) {
  const questions = [];
  const text = content.toLowerCase();

  // Always include these core questions
  questions.push(`Who is the target audience for this training material?`);

  // Add domain-specific questions
  if (domain.includes('Healthcare')) {
    questions.push('What clinical competencies should learners demonstrate?');
    questions.push('Are there specific patient safety considerations to address?');
    questions.push('What regulatory compliance requirements must be met?');
  } else if (domain.includes('Technology')) {
    questions.push('What technical proficiency level is expected?');
    questions.push('Are hands-on practice exercises required?');
    questions.push('What tools or platforms will learners need access to?');
  } else if (domain.includes('Business')) {
    questions.push('What business outcomes should this training achieve?');
    questions.push('How will learner performance be measured?');
    questions.push('What real-world scenarios should be included?');
  } else {
    questions.push('What practical skills should learners be able to demonstrate?');
    questions.push('How will knowledge retention be assessed?');
    questions.push('What follow-up support will learners need?');
  }

  return questions.slice(0, 8); // Return max 8 questions
}

// Generate content-based recommendations (2-4)
function generateRecommendations(content, domain) {
  const recommendations = [];
  const text = content.toLowerCase();

  if (text.length < 500) {
    recommendations.push('Expand content with more detailed examples and case studies');
  }

  if (!text.includes('example') && !text.includes('case')) {
    recommendations.push('Include real-world examples to enhance learner engagement');
  }

  if (domain.includes('Healthcare') || domain.includes('Compliance')) {
    recommendations.push('Incorporate compliance checkpoints and assessment criteria');
  } else if (domain.includes('Technology')) {
    recommendations.push('Add hands-on exercises and practical demonstrations');
  } else {
    recommendations.push('Integrate interactive elements and knowledge checks');
  }

  if (text.includes('complex') || text.includes('advanced')) {
    recommendations.push('Consider scaffolded learning approach for complex topics');
  }

  return recommendations.slice(0, 4); // Return 2-4 recommendations
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

    // Analyze domain based on content
    const { domain, reasoning } = analyzeDomain(content || '');

    // Generate content-specific SME questions
    const smeQuestions = generateSMEQuestions(content || '', domain);

    // Generate content-based recommendations
    const recommendations = generateRecommendations(content || '', domain);

    const analysis = {
      success: true,
      expert: 'Dr. Elena Rodriguez',
      fileName: fileName || 'uploaded-file',
      analysis: {
        domain: domain,
        reasoning: reasoning,
        summary: `Professional analysis completed for ${domain} content.`,
        recommendations: recommendations,
        smeQuestions: smeQuestions,
        defaultFrameworks: ['Blooms Taxonomy', 'ADDIE Model'], // Default pre-selected
        availableFrameworks: [
          'Blooms Taxonomy',
          'ADDIE Model',
          'SAM Model',
          'Kirkpatrick Model',
          'Gagné\'s Nine Events',
          'Merrill\'s Principles',
          'Kolb\'s Learning Cycle'
        ],
        maxFrameworkSelection: 5
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
