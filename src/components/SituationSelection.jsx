import { motion } from 'framer-motion';
import { useState } from 'react';
import concernsData from '../data/concerns.json';

const SituationSelection = ({ category, onSituationSelected }) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  const categoryData = concernsData[category];
  const situations = categoryData.situations;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* Header */}
      <motion.div
        className="text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-6xl mb-4">{categoryData.icon}</div>
        <motion.h1
          className="text-5xl md:text-6xl font-serif text-cosmic-gold mb-4"
          animate={{
            textShadow: [
              '0 0 20px rgba(255, 215, 0, 0.5)',
              '0 0 40px rgba(255, 215, 0, 0.8)',
              '0 0 20px rgba(255, 215, 0, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {categoryData.name}
        </motion.h1>
        <p className="text-lg text-purple-300 font-serif">
          어떤 상황인가요?
        </p>
      </motion.div>

      {/* Situation Options */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full relative z-10">
        {situations.map((situation, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hasAnimated ? { scale: 1.05, y: -10 } : {}}
            whileTap={{ scale: 0.98 }}
            transition={
              hasAnimated
                ? { duration: 0.2 }
                : {
                    opacity: { delay: index * 0.1 + 0.5, duration: 0.5 },
                    y: { delay: index * 0.1 + 0.5, duration: 0.5 },
                    scale: { duration: 0.2 },
                    default: { duration: 0.2 }
                  }
            }
            onAnimationComplete={() => setHasAnimated(true)}
            className="cursor-pointer"
            onClick={() => onSituationSelected(situation)}
          >
            <div className={`bg-gradient-to-br ${categoryData.color} rounded-2xl p-6 shadow-2xl hover:shadow-cosmic-gold/50 transition-shadow duration-200`}>
              <p className="text-xl font-serif text-white text-center">
                {situation}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SituationSelection;
