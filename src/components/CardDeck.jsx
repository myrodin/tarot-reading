import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import tarotData from '../data/tarotCards.json';

const CardDeck = ({ spreadType = 'one', onCardsSelected }) => {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [isSelecting, setIsSelecting] = useState(true);

  const cardCount = {
    one: 1,
    three: 3,
    celtic: 10
  };

  const maxCards = cardCount[spreadType];

  useEffect(() => {
    // Shuffle cards
    const shuffled = [...tarotData.majorArcana]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(12, tarotData.majorArcana.length));
    setShuffledCards(shuffled);
    setSelectedCards([]);
    setFlippedIndices([]);
    setIsSelecting(true);
  }, [spreadType]);

  const handleCardFlip = (index) => {
    if (!isSelecting || selectedCards.length >= maxCards) return;
    if (flippedIndices.includes(index)) return;

    const newFlippedIndices = [...flippedIndices, index];
    const newSelectedCards = [...selectedCards, shuffledCards[index]];

    setFlippedIndices(newFlippedIndices);
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === maxCards) {
      setIsSelecting(false);
      setTimeout(() => {
        onCardsSelected(newSelectedCards);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.h2
        className="text-3xl text-cosmic-gold font-serif mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isSelecting ? (
          `카드 ${maxCards}장을 선택하세요 (${selectedCards.length}/${maxCards})`
        ) : (
          '선택 완료! 해석을 확인하세요...'
        )}
      </motion.h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {shuffledCards.map((card, index) => (
          <Card
            key={index}
            card={card}
            isFlipped={flippedIndices.includes(index)}
            onFlip={() => handleCardFlip(index)}
            delay={index * 0.1}
          />
        ))}
      </div>

      <motion.div
        className="mt-8 text-purple-300 text-center text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>직관을 믿고 끌리는 카드를 선택하세요</p>
      </motion.div>
    </div>
  );
};

export default CardDeck;
