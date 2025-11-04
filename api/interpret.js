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

    // Gemini 2.5 Flash Lite - 더 가볍고 빠른 무료 모델
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.8,
        topK: 30,
        topP: 0.9,
        maxOutputTokens: 600,
      }
    });

    // 스프레드 타입별 레이블
    const spreadLabels = {
      one: ['오늘의 메시지'],
      three: ['과거', '현재', '미래']
    };
    const labels = spreadLabels[spreadType] || cards.map((_, i) => `카드 ${i + 1}`);

    // 카드 정보 구성
    const cardDescriptions = cards.map((card, index) => {
      const orientation = card.isReversed ? '역방향' : '정방향';
      const meaning = card.isReversed ? card.reversed : card.upright;
      return `${labels[index]}: ${card.name} (${card.koreanName}) - ${orientation}\n의미: ${meaning}`;
    }).join('\n\n');

    // 프롬프트 생성 (간소화)
    const prompt = `타로 리더로서 다음 상황에 대한 카드를 해석해주세요.

고민: ${category || '일반'} - ${situation || '전반적인 운세'}

카드:
${cardDescriptions}

각 카드를 2문장으로 간결하게 해석하고, JSON으로 응답하세요:
{"interpretations":[{"position":"${labels[0]}","message":"해석"}],"overallMessage":"전체 조언"}`;

    // Gemini API 호출 (재시도 로직 포함)
    let result, response, text;
    let retries = 3;

    for (let i = 0; i < retries; i++) {
      try {
        result = await model.generateContent(prompt);
        response = await result.response;
        text = response.text();
        break; // 성공하면 루프 탈출
      } catch (apiError) {
        if (i === retries - 1) throw apiError; // 마지막 시도 실패 시 에러 던지기

        // 503 에러면 잠시 대기 후 재시도
        if (apiError.status === 503) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // 1초, 2초, 3초 대기
          continue;
        }
        throw apiError; // 다른 에러는 즉시 던지기
      }
    }

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
