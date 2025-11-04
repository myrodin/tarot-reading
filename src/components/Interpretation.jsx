import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import concernsData from '../data/concerns.json';

const Interpretation = ({ cards, spreadType, category, situation }) => {
  const navigate = useNavigate();
  const categoryData = category ? concernsData[category] : null;
  const [aiInterpretation, setAiInterpretation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const spreadLabels = {
    one: ['오늘의 메시지'],
    three: ['과거', '현재', '미래']
  };

  const labels = spreadLabels[spreadType] || ['카드'];

  useEffect(() => {
    const fetchInterpretation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Vercel API 엔드포인트 호출
        // 로컬: http://localhost:3000/api/interpret
        // 프로덕션: https://your-vercel-app.vercel.app/api/interpret
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/interpret';

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cards,
            category: categoryData?.name,
            situation,
            spreadType
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch interpretation');
        }

        const data = await response.json();
        setAiInterpretation(data);
      } catch (err) {
        console.error('Error fetching AI interpretation:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterpretation();
  }, [cards, categoryData, situation, spreadType]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl text-cosmic-gold font-serif mb-4">
          당신의 타로 리딩
        </h2>
        {categoryData && situation && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-purple-300">
              <span className="text-2xl">{categoryData.icon}</span>
              <span className="text-lg font-serif">{categoryData.name}</span>
            </div>
            <p className="text-purple-200 text-sm max-w-md">
              "{situation}"
            </p>
          </div>
        )}
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          className="text-center text-purple-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-4 animate-pulse">🔮</div>
          <p className="text-xl font-serif">카드를 해석하고 있습니다...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          className="max-w-2xl w-full text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-red-900/30 border-2 border-red-500/50 rounded-xl p-6 mb-8">
            <p className="text-red-300 mb-4">AI 해석을 불러오는 중 오류가 발생했습니다.</p>
            <p className="text-sm text-gray-400">기본 해석을 표시합니다.</p>
          </div>
        </motion.div>
      )}

      {/* AI Interpretation */}
      {!loading && aiInterpretation && (
        <div className="max-w-4xl w-full space-y-8">
          {aiInterpretation.interpretations?.map((interp, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-6 border-2 border-purple-500/30 backdrop-blur-sm"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3 }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Card Image */}
                <div className="flex-shrink-0">
                  <div className={`w-32 h-48 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg border-4 ${cards[index].isReversed ? 'border-purple-700' : 'border-cosmic-gold'} p-4 flex flex-col items-center justify-center shadow-xl`}>
                    <div
                      className="text-5xl mb-2"
                      style={{
                        transform: cards[index].isReversed ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      {cards[index].image}
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-purple-900">
                        {cards[index].isReversed ? '⬇️ ' : '⬆️ '}{cards[index].name}
                      </div>
                      <div className="text-xs text-purple-700">{cards[index].koreanName}</div>
                    </div>
                  </div>
                </div>

                {/* AI Interpretation */}
                <div className="flex-1 text-white">
                  <div className="mb-4">
                    <span className="inline-block bg-cosmic-gold/20 text-cosmic-gold px-3 py-1 rounded-full text-sm font-semibold">
                      {interp.position || labels[index]}
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif mb-4 text-cosmic-gold">
                    {cards[index].name} - {cards[index].koreanName}
                    {cards[index].isReversed && (
                      <span className="text-sm text-purple-300 ml-2">(역방향)</span>
                    )}
                  </h3>

                  <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                    {interp.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Overall Message */}
          {aiInterpretation.overallMessage && (
            <motion.div
              className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-xl p-6 border-2 border-cosmic-gold/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cards.length * 0.3 + 0.3 }}
            >
              <h4 className="text-xl font-serif text-cosmic-gold mb-3">✨ 전체 메시지</h4>
              <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                {aiInterpretation.overallMessage}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Fallback: Show static interpretation if AI fails */}
      {!loading && error && (
        <div className="max-w-4xl w-full space-y-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-6 border-2 border-purple-500/30 backdrop-blur-sm"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3 }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className={`w-32 h-48 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg border-4 ${card.isReversed ? 'border-purple-700' : 'border-cosmic-gold'} p-4 flex flex-col items-center justify-center shadow-xl`}>
                    <div
                      className="text-5xl mb-2"
                      style={{
                        transform: card.isReversed ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      {card.image}
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-purple-900">
                        {card.isReversed ? '⬇️ ' : '⬆️ '}{card.name}
                      </div>
                      <div className="text-xs text-purple-700">{card.koreanName}</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-white">
                  <div className="mb-4">
                    <span className="inline-block bg-cosmic-gold/20 text-cosmic-gold px-3 py-1 rounded-full text-sm font-semibold">
                      {labels[index] || `카드 ${index + 1}`}
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif mb-2 text-cosmic-gold">
                    {card.name} - {card.koreanName}
                    {card.isReversed && (
                      <span className="text-sm text-purple-300 ml-2">(역방향)</span>
                    )}
                  </h3>

                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {card.keywords.map((keyword, i) => (
                        <span key={i} className="text-xs bg-purple-500/30 px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {!card.isReversed ? (
                      <div>
                        <div className="text-sm font-semibold text-purple-300 mb-1">정방향 의미</div>
                        <p className="text-gray-300 leading-relaxed">{card.upright}</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-semibold text-purple-300 mb-1">역방향 의미</div>
                        <p className="text-gray-300 leading-relaxed">{card.reversed}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        className="mt-12 flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: cards.length * 0.3 + 0.5 }}
      >
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
        >
          다시 보기
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl"
        >
          홈으로
        </button>
      </motion.div>
    </div>
  );
};

export default Interpretation;
