import React from "react";
import { Helmet } from "react-helmet";

import { useShotBalances } from "@/api/hooks/useShotBalances";
import ShotBetsDashboard from "@/components/ShotBetsDashboard";
import ShotBetsLoading from "@/components/ui/ShotBetLoading";
import ShotBetsError from "@/components/ui/ShotBetError";
import { useEvents } from "@/api/hooks/useEvents";

const Dashboard: React.FC = () => {
  const query = useShotBalances();
  const eventsQuery = useEvents();

  if (query.isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ShotBetsLoading />
      </div>
    );
  if (query.error)
    return (
      <div className="flex justify-center items-center h-screen">
        <ShotBetsError onRetry={() => console.log("retry")} />
      </div>
    );

  return (
    <div className="container mx-auto py-4">
      <Helmet>
        <title>Call Your Shot</title>
      </Helmet>
      <ShotBetsDashboard data={query.data} events={eventsQuery.data?.events} />
    </div>
  );
};

export default Dashboard;
