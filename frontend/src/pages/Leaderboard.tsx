import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Book } from "lucide-react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useShotBalances } from "@/api/hooks/useShotBalances";
import LeaderboardComponent from "@/components/Leaderboard";
import ShotBetsLoading from "@/components/ui/ShotBetLoading";

const Leaderboard: React.FC = () => {
  const query = useShotBalances();
  const navigate = useNavigate();

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
      <Card
        className="shadow-xl overflow-hidden transition-shadow duration-200 transform hover:-translate-y-1 cursor-pointer mt-8"
        onClick={() => navigate(`/rules`)}
      >
        <CardHeader className="bg-white p-4 flex items-center">
          <Book className="h-6 w-6 text-gray-800" />
          <CardTitle className="text-lg font-semibold text-gray-800">
            Read the Rules
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Leaderboard;
