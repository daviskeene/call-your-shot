import React from "react";
import { useShotBalances } from "../api/hooks/useShotBalances";
import LeaderboardComponent from "@/components/Leaderboard";
import ShotBetsLoading from "@/components/ui/ShotBetLoading";
import { Helmet } from "react-helmet";

const Leaderboard: React.FC = () => {
  const query = useShotBalances();

  if (query.isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ShotBetsLoading />
      </div>
    );
  if (query.error)
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading data.
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Call Your Shot | Leaderboard</title>
      </Helmet>
      <LeaderboardComponent data={query.data} />
    </div>
  );
};

export default Leaderboard;
