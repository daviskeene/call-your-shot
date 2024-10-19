import React from "react";
import { useShotBalances } from "../api/hooks/useShotBalances";
import ShotBetsDashboard from "@/components/ShotBetsDashboard";

const Dashboard: React.FC = () => {
  const query = useShotBalances();

  if (query.isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (query.error)
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading data.
      </div>
    );

  return (
    <div className="container mx-auto py-4">
      <ShotBetsDashboard data={query.data} />
    </div>
  );
};

export default Dashboard;
