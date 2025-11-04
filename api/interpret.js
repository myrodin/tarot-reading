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
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
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

    // 프롬프트 생성
    const prompt = `당신은 전문 타로 리더입니다. 다음 상황에 대해 뽑은 타로 카드들을 해석해주세요.

**고민 상황:**
카테고리: ${category || '일반'}
상황: ${situation || '전반적인 운세'}

**뽑은 카드:**
${cardDescriptions}

**요청사항:**
1. 각 카드를 고민 상황과 연결하여 구체적으로 해석해주세요
2. 카드의 정방향/역방향 의미를 상황에 맞게 적용해주세요
3. 따뜻하고 공감적인 어조로 작성해주세요
4. 각 카드마다 2-3문장 정도로 간결하게 해석해주세요
5. 실천 가능한 조언을 포함해주세요

다음 JSON 형식으로 응답해주세요:
{
  "interpretations": [
    {
      "position": "과거/현재/미래 등",
      "message": "해당 카드의 해석 내용"
    }
  ],
  "overallMessage": "전체적인 조언 및 메시지 (2-3문장)"
}`;

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
