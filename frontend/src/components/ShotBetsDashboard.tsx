import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Network, TrendingUp, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import ShotBetsLoading from "./ui/ShotBetLoading";
import ShotBetsFeed from "./ShotBetsFeed";

type Node = {
  id: number;
  name: string;
};

type Edge = {
  from: number;
  to: number;
  value: number;
  reason: string;
  outcome: string | null;
  dateCreated: string;
  id: number;
};

type LeaderboardEntry = {
  id: number;
  name: string;
  totalShotsOwed: number;
  totalShotsOwedTo: number;
};

export type DashboardData = {
  nodes: Node[];
  edges: Edge[];
  leaderboard: LeaderboardEntry[];
};

export type ShotBetsDashboardProps = {
  data: DashboardData | undefined;
  events: any;
};

export const getColorClass = (outcome: string | boolean | null) => {
  if (outcome === "incomplete") {
    return "bg-yellow-200 text-orange-900";
  } else if (outcome === "expired") {
    return "bg-red-200 text-red-900";
  } else if (!!outcome) {
    return "bg-green-100 text-green-800";
  }
  return "";
};

// New StatCard component for consistent card styling
const StatCard: React.FC<{
  title: string;
  value: string;
  subValue: string;
  icon: React.ReactNode;
  trend: string;
}> = ({ title, value, subValue, icon, trend }) => (
  <Card className="overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
    <CardHeader className="bg-white p-4">
      <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
        <span>{title}</span>
        {icon}
      </CardTitle>
    </CardHeader>
    <CardContent className="bg-white p-6">
      <p className="text-2xl font-extrabold text-gray-900 mb-2">{value}</p>
      <p className="text-sm text-gray-600 mb-4">{subValue}</p>
      <div className="text-xs font-medium text-gray-500 flex items-center">
        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
        {trend}
      </div>
    </CardContent>
  </Card>
);

const ShotBetsDashboard: React.FC<ShotBetsDashboardProps> = ({
  data,
  events,
}) => {
  const navigate = useNavigate();

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ShotBetsLoading />
      </div>
    );
  }

  const { nodes, edges, leaderboard } = data;

  const activeEdges = edges.filter((edge) => !edge.outcome);

  const nodeMap = useMemo(() => {
    return nodes.reduce(
      (acc, node) => {
        acc[node.id] = node.name;
        return acc;
      },
      {} as Record<number, string>,
    );
  }, [nodes]);

  const topOwer = useMemo(() => {
    return leaderboard.reduce(
      (max, entry) => (entry.totalShotsOwed > max.totalShotsOwed ? entry : max),
      {} as any,
    );
  }, [leaderboard]);

  const topOwed = useMemo(() => {
    return leaderboard.reduce(
      (max, entry) =>
        entry.totalShotsOwedTo > max.totalShotsOwedTo ? entry : max,
      {} as any,
    );
  }, [leaderboard]);

  const oldestShot: Edge | undefined = useMemo(() => {
    return activeEdges
      .filter((edge) => !edge.outcome)
      .reduce(
        (oldest, current) =>
          !oldest ||
          new Date(current.dateCreated) < new Date(oldest.dateCreated)
            ? current
            : oldest,
        activeEdges[0],
      );
  }, [edges]);

  const totalShots = useMemo(() => {
    return activeEdges.reduce((sum, edge) => sum + edge.value, 0);
  }, [edges]);

  const mostDistinctBets = useMemo(() => {
    const distinctBets = nodes.map((node) => ({
      id: node.id,
      name: node.name,
      distinct: new Set(
        edges
          .filter((edge) => edge.from === node.id && !edge.outcome)
          .map((edge) => edge.to),
      ).size,
    }));
    return distinctBets.reduce(
      (max, entry) => (entry.distinct > max.distinct ? entry : max),
      {
        id: 0,
        name: "",
        distinct: 0,
      },
    );
  }, [nodes, edges]);

  return (
    <div className="min-h-screen pt-4">
      <header className="bg-white text-left mb-8">
        <div className="w-100 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Shot Bets Dashboard
          </h1>
          <Button
            variant="outline"
            aria-label="New Shot Bet"
            onClick={() => navigate("/create-bet")}
          >
            New Shot Bet
          </Button>
        </div>
        <p className="text-xl text-gray-600">
          Tracking and testing our liquid luck.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          title="Most Shots To Call"
          value={topOwer.name || "Nobody... yet!"}
          subValue={`${
            topOwer.totalShotsOwed || "No outstanding "
          } shots in ${new Date().getFullYear()}`}
          icon={<Trophy className="h-8 w-8 text-indigo-500" />}
          trend={`${((topOwer.totalShotsOwed / totalShots) * 100 || 0).toFixed(
            1,
          )}% of all bets`}
        />
        <StatCard
          title="Most Shots To Take"
          value={topOwed.name || "Nobody... yet!"}
          subValue={`${
            topOwed.totalShotsOwedTo || "No outstanding "
          } shots in ${new Date().getFullYear()}`}
          icon={<Users className="h-8 w-8 text-indigo-500" />}
          trend={`${(
            (topOwed.totalShotsOwedTo / totalShots) * 100 || 0
          ).toFixed(1)}% of all bets`}
        />
        <StatCard
          title="Oldest Outstanding Shot"
          value={
            oldestShot
              ? `${oldestShot.value} shot(s) on ${nodeMap[oldestShot.to]}`
              : "No outstanding shots"
          }
          subValue={
            oldestShot
              ? oldestShot.reason
              : "Oldest active bet will appear here"
          }
          icon={<Clock className="h-8 w-8 text-indigo-500" />}
          trend={
            oldestShot
              ? formatDistanceToNow(new Date(oldestShot.dateCreated), {
                  addSuffix: true,
                })
              : "0"
          }
        />
        <StatCard
          title="Most Diverse Bettor"
          value={mostDistinctBets.name || "Nobody... yet!"}
          subValue={`Bets with ${mostDistinctBets.distinct} different people`}
          icon={<Network className="h-8 w-8 text-indigo-500" />}
          trend={`${(
            (mostDistinctBets.distinct / (nodes.length - 1)) *
            100
          ).toFixed(1)}% of possible connections`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        <StatCard
          title="Total Shots at Stake"
          value={`${totalShots} shots`}
          subValue={`Across ${activeEdges.length} active bets`}
          icon={<TrendingUp className="h-8 w-8 text-indigo-500" />}
          trend={`${(totalShots / activeEdges.length || 0).toFixed(
            1,
          )} shots per bet on average`}
        />
        <StatCard
          title="Total Shot Bets Recorded"
          value={`${edges.length}`}
          subValue={`Between ${nodes.length} people`}
          icon={<Users className="h-8 w-8 text-indigo-500" />}
          trend={`${
            edges.length - activeEdges.length
          } total resolved bets since 2024`}
        />
      </div>
      <header className="bg-white text-left mb-8">
        <div className="w-100 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2 mt-2">
            Activity Feed
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          Explore all bet creations and resolutions in a unified timeline.
        </p>
      </header>
      <ShotBetsFeed events={events} />
    </div>
  );
};

export default ShotBetsDashboard;
