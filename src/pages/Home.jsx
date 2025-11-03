import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [hasAnimated, setHasAnimated] = useState(false);

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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-6xl md:text-7xl font-serif text-cosmic-gold mb-4"
          animate={{
            textShadow: [
              '0 0 20px rgba(255, 215, 0, 0.5)',
              '0 0 40px rgba(255, 215, 0, 0.8)',
              '0 0 20px rgba(255, 215, 0, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          신비로운 타로
        </motion.h1>
        <p className="text-xl text-purple-300 font-serif">
          카드가 전하는 메시지를 들어보세요
        </p>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="text-8xl mb-12"
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
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
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
            <div className={`bg-gradient-to-br ${spread.color} rounded-2xl p-8 shadow-2xl hover:shadow-cosmic-gold/50 transition-shadow duration-200`}>
              <div className="text-6xl mb-4 text-center animate-float">
                {spread.icon}
              </div>
              <h2 className="text-2xl font-serif text-white mb-2 text-center">
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
        className="text-purple-400 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p>마음을 열고 직관을 믿으세요</p>
        <p className="text-xs mt-2">카드는 당신 내면의 지혜를 반영합니다</p>
      </motion.div>

      {/* Animated stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-cosmic-gold opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
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
