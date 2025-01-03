import React from "react";
import { Helmet } from "react-helmet";

import BetForm from "../components/BetForm";

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
