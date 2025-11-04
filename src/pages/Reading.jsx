import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CategorySelection from '../components/CategorySelection';
import SituationSelection from '../components/SituationSelection';
import CardDeck from '../components/CardDeck';
import Interpretation from '../components/Interpretation';

const Reading = () => {
  const { type } = useParams();
  const [step, setStep] = useState('category'); // category, situation, cards, result
  const [category, setCategory] = useState(null);
  const [situation, setSituation] = useState(null);
  const [selectedCards, setSelectedCards] = useState(null);

  const handleCategorySelected = (selectedCategory) => {
    setCategory(selectedCategory);
    setStep('situation');
  };

  const handleSituationSelected = (selectedSituation) => {
    setSituation(selectedSituation);
    setStep('cards');
  };

  const handleCardsSelected = (cards) => {
    setSelectedCards(cards);
    setStep('result');
  };

  return (
    <div className="min-h-screen">
      {step === 'category' && (
        <CategorySelection onCategorySelected={handleCategorySelected} />
      )}
      {step === 'situation' && (
        <SituationSelection
          category={category}
          onSituationSelected={handleSituationSelected}
        />
      )}
      {step === 'cards' && (
        <CardDeck spreadType={type} onCardsSelected={handleCardsSelected} />
      )}
      {step === 'result' && (
        <Interpretation
          cards={selectedCards}
          spreadType={type}
          category={category}
          situation={situation}
        />
      )}
    </div>
  );
};

export default Reading;
