import { motion } from 'framer-motion';
import { useState } from 'react';
import concernsData from '../data/concerns.json';

const CategorySelection = ({ onCategorySelected }) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  const categories = Object.entries(concernsData).map(([key, value]) => ({
    id: key,
    ...value
  }));

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
          className="text-3xl md:text-5xl lg:text-6xl font-serif text-cosmic-gold mb-4"
          animate={{
            textShadow: [
              '0 0 20px rgba(255, 215, 0, 0.5)',
              '0 0 40px rgba(255, 215, 0, 0.8)',
              '0 0 20px rgba(255, 215, 0, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          어떤 고민이 있으신가요?
        </motion.h1>
        <p className="text-base md:text-lg text-purple-300 font-serif">
          카테고리를 선택해주세요
        </p>
      </motion.div>

      {/* Category Grid */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl w-full relative z-10">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
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
            onClick={() => onCategorySelected(category.id)}
          >
            <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl hover:shadow-cosmic-gold/50 transition-shadow duration-200`}>
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 md:mb-4 text-center animate-float">
                {category.icon}
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-white text-center">
                {category.name}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;
