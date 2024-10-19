import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Network, TrendingUp, Diamond } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

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
    <CardHeader className="bg-white p-6">
      <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
        <span>{title}</span>
        {icon}
      </CardTitle>
    </CardHeader>
    <CardContent className="bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <p className="text-3xl font-extrabold text-gray-900 mb-2">{value}</p>
      <p className="text-sm text-gray-600 mb-4">{subValue}</p>
      <div className="text-xs font-medium text-gray-500 flex items-center">
        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
        {trend}
      </div>
    </CardContent>
  </Card>
);

const ShotBetsDashboard: React.FC<ShotBetsDashboardProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const { nodes, edges, leaderboard } = data;

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
    return leaderboard.reduce((max, entry) =>
      entry.totalShotsOwed > max.totalShotsOwed ? entry : max,
    );
  }, [leaderboard]);

  const topOwed = useMemo(() => {
    return leaderboard.reduce((max, entry) =>
      entry.totalShotsOwedTo > max.totalShotsOwedTo ? entry : max,
    );
  }, [leaderboard]);

  const oldestShot = useMemo(() => {
    return edges.reduce((oldest, current) =>
      new Date(current.dateCreated) < new Date(oldest.dateCreated)
        ? current
        : oldest,
    );
  }, [edges]);

  console.log(oldestShot);

  const totalShots = useMemo(() => {
    return edges.reduce((sum, edge) => sum + edge.value, 0);
  }, [edges]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };
  const mostDistinctBets = useMemo(() => {
    const distinctBets = nodes.map((node) => ({
      id: node.id,
      name: node.name,
      distinct: new Set(
        edges.filter((edge) => edge.from === node.id).map((edge) => edge.to),
      ).size,
    }));
    return distinctBets.reduce((max, entry) =>
      entry.distinct > max.distinct ? entry : max,
    );
  }, [nodes, edges]);

  return (
    <div className="min-h-screen pt-4">
      <header className="bg-white text-left mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Shot Bets Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Tracking and testing our liquid luck. Made with ❤️ by Davis Keene.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <StatCard
          title="Most Shots Owed"
          value={topOwer.name}
          subValue={`${topOwer.totalShotsOwed} shots`}
          icon={<Diamond className="h-8 w-8 text-purple-500" />}
          trend={`${((topOwer.totalShotsOwed / totalShots) * 100).toFixed(
            1,
          )}% of all bets`}
        />
        <StatCard
          title="Most Shots Owed To"
          value={topOwed.name}
          subValue={`${topOwed.totalShotsOwedTo} shots`}
          icon={<Users className="h-8 w-8 text-indigo-500" />}
          trend={`${((topOwed.totalShotsOwedTo / totalShots) * 100).toFixed(
            1,
          )}% of all bets`}
        />
        <StatCard
          title="Oldest Outstanding Shot"
          value={`${nodeMap[oldestShot.from]} owes ${nodeMap[oldestShot.to]}`}
          subValue={oldestShot.reason}
          icon={<Clock className="h-8 w-8 text-blue-500" />}
          trend={formatDistanceToNow(new Date(oldestShot.dateCreated), {
            addSuffix: true,
          })}
        />
        <StatCard
          title="Most Diverse Bettor"
          value={mostDistinctBets.name}
          subValue={`Bets with ${mostDistinctBets.distinct} different people`}
          icon={<Network className="h-8 w-8 text-green-500" />}
          trend={`${(
            (mostDistinctBets.distinct / (nodes.length - 1)) *
            100
          ).toFixed(1)}% of possible connections`}
        />
        <StatCard
          title="Total Shots at Stake"
          value={`${totalShots} shots`}
          subValue={`Across ${edges.length} bets`}
          icon={<TrendingUp className="h-8 w-8 text-red-500" />}
          trend={`${(totalShots / edges.length).toFixed(
            1,
          )} shots per bet on average`}
        />
      </div>

      <Card className="shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
            <Diamond className="h-6 w-6" />
            <span>Shot Bets Log</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="font-bold text-gray-800">
                    From
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">To</TableHead>
                  <TableHead className="font-bold text-gray-800">
                    Shots
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    Reason
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    Date
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    Outcome
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {edges.map((edge, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <TableCell className="font-medium">
                      {nodeMap[edge.from]}
                    </TableCell>
                    <TableCell className="font-medium">
                      {nodeMap[edge.to]}
                    </TableCell>
                    <TableCell>{edge.value}</TableCell>
                    <TableCell>{edge.reason}</TableCell>
                    <TableCell>{formatDate(edge.dateCreated)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          edge.outcome
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {edge.outcome || "Pending"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShotBetsDashboard;
