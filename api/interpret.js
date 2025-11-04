import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cards, category, situation, spreadType } = req.body;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ error: 'Cards are required' });
    }

    // Gemini API 초기화
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Gemini 2.5 Flash - 안정적이고 빠른 무료 모델
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.8,
        topK: 30,
        topP: 0.9,
        maxOutputTokens: 800,
      }
    });

    // 스프레드 타입별 레이블
    const spreadLabels = {
      one: ['오늘의 메시지'],
      three: ['과거', '현재', '미래']
    };
    const labels = spreadLabels[spreadType] || cards.map((_, i) => `카드 ${i + 1}`);

    // 카드 정보 구성
    const cardDescriptions = cards.map((card, index) =>
      `${labels[index]}: ${card.name} (${card.koreanName})\n키워드: ${card.keywords.join(', ')}\n정방향: ${card.upright}\n역방향: ${card.reversed}`
    ).join('\n\n');

    // 프롬프트 생성 (간소화)
    const prompt = `타로 리더로서 다음 상황에 대한 카드를 해석해주세요.

고민: ${category || '일반'} - ${situation || '전반적인 운세'}

카드:
${cardDescriptions}

각 카드를 2문장으로 간결하게 해석하고, JSON으로 응답하세요:
{"interpretations":[{"position":"${labels[0]}","message":"해석"}],"overallMessage":"전체 조언"}`;

    // Gemini API 호출
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 파싱 시도
    let parsedResponse;
    try {
      // JSON 블록 추출 (마크다운 코드 블록 제거)
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      parsedResponse = JSON.parse(jsonText);
    } catch (parseError) {
      // JSON 파싱 실패 시 텍스트 그대로 반환
      parsedResponse = {
        interpretations: cards.map((card, index) => ({
          position: labels[index],
          message: text
        })),
        overallMessage: '카드가 전하는 메시지를 깊이 생각해보세요.'
      };
    }

    return res.status(200).json(parsedResponse);

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'Failed to generate interpretation',
      details: error.message
    });
  }
}
