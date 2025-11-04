export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    // REST API로 직접 모델 목록 가져오기
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return res.status(200).json({
      message: 'Available models',
      models: data.models?.map(m => ({
        name: m.name,
        displayName: m.displayName,
        description: m.description,
        supportedGenerationMethods: m.supportedGenerationMethods
      })) || []
    });

  } catch (error) {
    console.error('Error listing models:', error);
    return res.status(500).json({
      error: 'Failed to list models',
      details: error.message
    });
  }
}
