import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import tarotData from '../data/tarotCards.json';

const CardDeck = ({ spreadType = 'one', onCardsSelected }) => {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [cardOrientations, setCardOrientations] = useState({});
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
    setCardOrientations({});
    setIsSelecting(true);
  }, [spreadType]);

  const handleCardFlip = (index) => {
    if (!isSelecting || selectedCards.length >= maxCards) return;
    if (flippedIndices.includes(index)) return;

    const newFlippedIndices = [...flippedIndices, index];

    // 랜덤하게 정방향(false) 또는 역방향(true) 결정
    const isReversed = Math.random() < 0.5;
    const cardWithOrientation = {
      ...shuffledCards[index],
      isReversed
    };

    const newSelectedCards = [...selectedCards, cardWithOrientation];

    // 카드 방향 정보 저장
    setCardOrientations(prev => ({
      ...prev,
      [index]: isReversed
    }));

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 lg:p-8">
      <motion.h2
        className="text-xl md:text-2xl lg:text-3xl text-cosmic-gold font-serif mb-6 md:mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isSelecting ? (
          `카드 ${maxCards}장을 선택하세요 (${selectedCards.length}/${maxCards})`
        ) : (
          '선택 완료! 해석을 확인하세요...'
        )}
      </motion.h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {shuffledCards.map((card, index) => {
          // 카드에 방향 정보 추가
          const cardWithOrientation = {
            ...card,
            isReversed: cardOrientations[index] || false
          };

          return (
            <Card
              key={index}
              card={cardWithOrientation}
              isFlipped={flippedIndices.includes(index)}
              onFlip={() => handleCardFlip(index)}
              delay={index * 0.1}
            />
          );
        })}
      </div>

      <motion.div
        className="mt-6 md:mt-8 text-purple-300 text-center text-sm"
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
