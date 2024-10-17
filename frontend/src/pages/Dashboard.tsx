import React from 'react';
import { useShotBalances } from '../api/hooks/useShotBalances';
import GraphVisualization from '../components/GraphVisualization';
import ShotBetsLeaderboard from '@/components/ShotBetsLeaderboard';

const Dashboard: React.FC = () => {
  const query  = useShotBalances();

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
    <div className="space-y-8">
      {/* Leaderboard Section */}
      <section>
        <ShotBetsLeaderboard leaderboard={query.data?.leaderboard || []} />
      </section>

      {/* Graph Visualization Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Network</h2>
        <GraphVisualization query={query} />
      </section>
    </div>
  );
};

export default Dashboard;
