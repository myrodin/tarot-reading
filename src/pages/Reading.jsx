import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CardDeck from '../components/CardDeck';
import Interpretation from '../components/Interpretation';

const Reading = () => {
  const { type } = useParams();
  const [selectedCards, setSelectedCards] = useState(null);

  const handleCardsSelected = (cards) => {
    setSelectedCards(cards);
  };

  return (
    <div className="min-h-screen">
      {!selectedCards ? (
        <CardDeck spreadType={type} onCardsSelected={handleCardsSelected} />
      ) : (
        <Interpretation cards={selectedCards} spreadType={type} />
      )}
    </div>
  );
};

export default Reading;
