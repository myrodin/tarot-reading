import { GoogleGenerativeAI } from '@google/generative-ai';

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 사용 가능한 모델 목록 가져오기
    const models = await genAI.listModels();

    return res.status(200).json({
      message: 'Available models',
      models: models.map(m => ({
        name: m.name,
        displayName: m.displayName,
        supportedGenerationMethods: m.supportedGenerationMethods
      }))
    });

  } catch (error) {
    console.error('Error listing models:', error);
    return res.status(500).json({
      error: 'Failed to list models',
      details: error.message
    });
  }
}
