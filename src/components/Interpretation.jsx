import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Interpretation = ({ cards, spreadType }) => {
  const navigate = useNavigate();

  const spreadLabels = {
    one: ['오늘의 메시지'],
    three: ['과거', '현재', '미래']
  };

  const labels = spreadLabels[spreadType] || ['카드'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.h2
        className="text-4xl text-cosmic-gold font-serif mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        당신의 타로 리딩
      </motion.h2>

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
              {/* Card Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-48 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg border-4 border-cosmic-gold p-4 flex flex-col items-center justify-center shadow-xl">
                  <div className="text-5xl mb-2">{card.image}</div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-purple-900">{card.name}</div>
                    <div className="text-xs text-purple-700">{card.koreanName}</div>
                  </div>
                </div>
              </div>

              {/* Interpretation */}
              <div className="flex-1 text-white">
                <div className="mb-4">
                  <span className="inline-block bg-cosmic-gold/20 text-cosmic-gold px-3 py-1 rounded-full text-sm font-semibold">
                    {labels[index] || `카드 ${index + 1}`}
                  </span>
                </div>

                <h3 className="text-2xl font-serif mb-2 text-cosmic-gold">
                  {card.name} - {card.koreanName}
                </h3>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {card.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="text-xs bg-purple-500/30 px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-semibold text-purple-300 mb-1">
                      정방향 의미
                    </div>
                    <p className="text-gray-300 leading-relaxed">{card.upright}</p>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-purple-300 mb-1">
                      역방향 의미
                    </div>
                    <p className="text-gray-300 leading-relaxed">{card.reversed}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
