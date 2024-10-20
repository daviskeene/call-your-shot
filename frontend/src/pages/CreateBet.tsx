import React from "react";
import BetForm from "../components/BetForm";
import { Helmet } from "react-helmet";

const CreateBet: React.FC = () => {
  return (
    <div className="pt-8">
      <Helmet>
        <title>Call Your Shot | Create Bet</title>
      </Helmet>
      <BetForm />
    </div>
  );
};

export default CreateBet;
