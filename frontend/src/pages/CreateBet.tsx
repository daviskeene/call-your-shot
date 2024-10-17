import React from 'react';
import BetForm from '../components/BetForm';

const CreateBet: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Create a New Bet</h2>
      <BetForm />
    </div>
  );
};

export default CreateBet;
