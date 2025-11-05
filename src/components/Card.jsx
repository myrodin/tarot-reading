import { motion } from 'framer-motion';
import { useState } from 'react';

const Card = ({ card, isFlipped, onFlip, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isPendingHover, setIsPendingHover] = useState(false);

  return (
    <motion.div
      className="card-perspective cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        hasAnimated
          ? { duration: 0.2 }
          : { delay, duration: 0.5 }
      }
      whileHover={hasAnimated ? { y: -10 } : {}}
      onAnimationComplete={() => {
        setHasAnimated(true);
        if (isPendingHover) {
          setIsHovered(true);
        }
      }}
      onHoverStart={() => {
        if (hasAnimated) {
          setIsHovered(true);
        } else {
          setIsPendingHover(true);
        }
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setIsPendingHover(false);
      }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-28 h-42 sm:w-32 sm:h-48 md:w-40 md:h-60"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Back */}
        <div
          className="absolute w-full h-full rounded-lg shadow-xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <div className={`w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 rounded-lg border-4 border-cosmic-gold flex items-center justify-center transition-shadow duration-200 ${isHovered ? 'shadow-[0_0_20px_rgba(255,215,0,0.8)]' : ''}`}>
            <div className="text-4xl sm:text-5xl md:text-6xl">✨</div>
          </div>
        </div>

        {/* Card Front */}
        <div
          className="absolute w-full h-full rounded-lg shadow-xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className={`w-full h-full bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg border-4 ${card.isReversed ? 'border-purple-700' : 'border-cosmic-gold'} p-4 flex flex-col items-center justify-center transition-colors duration-300`}>
            <div
              className="text-3xl sm:text-4xl md:text-5xl mb-2 transition-transform duration-300"
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
      </motion.div>
    </motion.div>
  );
};

export default Card;
