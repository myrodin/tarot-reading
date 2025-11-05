import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [hasAnimated, setHasAnimated] = useState(false);

  // Memoize star positions to prevent re-render
  const stars = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2
    }));
  }, []);

  const spreads = [
    {
      type: 'one',
      name: '원카드 리딩',
      description: '오늘의 운세를 간단하게',
      icon: '🃏',
      color: 'from-purple-600 to-indigo-600'
    },
    {
      type: 'three',
      name: '쓰리카드 스프레드',
      description: '과거, 현재, 미래를 살펴보세요',
      icon: '🔮',
      color: 'from-indigo-600 to-blue-600'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 relative">
      {/* Header */}
      <motion.div
        className="text-center mb-8 md:mb-12 lg:mb-16 relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-cosmic-gold mb-4"
          animate={{
            textShadow: [
              '0 0 20px rgba(255, 215, 0, 0.5)',
              '0 0 40px rgba(255, 215, 0, 0.8)',
              '0 0 20px rgba(255, 215, 0, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          타로 고민 상담소
        </motion.h1>
        <p className="text-lg md:text-xl text-purple-300 font-serif">
          당신을 괴롭히고 있는 게 무엇인가요?
        </p>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="text-5xl md:text-7xl lg:text-8xl mb-6 md:mb-10 lg:mb-12 relative z-10"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ✨
      </motion.div>

      {/* Spread Options */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-4xl w-full mb-8 md:mb-10 lg:mb-12 relative z-10">
        {spreads.map((spread, index) => (
          <motion.div
            key={spread.type}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hasAnimated ? { scale: 1.05, y: -10 } : {}}
            whileTap={{ scale: 0.98 }}
            transition={
              hasAnimated
                ? { duration: 0.2 }
                : {
                    opacity: { delay: index * 0.2 + 0.5, duration: 0.5 },
                    y: { delay: index * 0.2 + 0.5, duration: 0.5 },
                    scale: { duration: 0.2 },
                    default: { duration: 0.2 }
                  }
            }
            onAnimationComplete={() => setHasAnimated(true)}
            className="cursor-pointer"
            onClick={() => navigate(`/reading/${spread.type}`)}
          >
            <div className={`bg-gradient-to-br ${spread.color} rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl hover:shadow-cosmic-gold/50 transition-shadow duration-200`}>
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 md:mb-4 text-center animate-float">
                {spread.icon}
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-white mb-2 text-center">
                {spread.name}
              </h2>
              <p className="text-purple-200 text-center text-sm">
                {spread.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        className="text-purple-400 text-sm text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p>마음을 열고 직관을 믿으세요</p>
        <p className="text-xs mt-2">카드는 당신 내면의 지혜를 반영합니다</p>
      </motion.div>

      {/* Animated stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute text-cosmic-gold"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          >
            ⭐
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
