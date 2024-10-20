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
import {
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { DashboardData } from "./ShotBetsDashboard";
import { useNavigate } from "react-router-dom";

type LeaderboardProps = {
  data: DashboardData | undefined;
};

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const navigate = useNavigate();

  const leaderboardData = useMemo(() => {
    if (!data) return [];

    return data.leaderboard
      .map((entry) => {
        const userEdges = data.edges.filter(
          (edge) => edge.from === entry.id || edge.to === entry.id,
        );
        const betsWon = userEdges.filter(
          (edge) => edge.from === entry.id && edge.outcome === "won",
        ).length;
        const betsLost = userEdges.filter(
          (edge) => edge.to === entry.id && edge.outcome === "won",
        ).length;

        return {
          ...entry,
          betsWon,
          betsLost,
        };
      })
      .sort(
        (a, b) =>
          b.totalShotsOwedTo -
          b.totalShotsOwed -
          (a.totalShotsOwedTo - a.totalShotsOwed),
      );
  }, [data]);

  return (
    <Card className="shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
        <CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
          <Trophy className="h-6 w-6" />
          <span>Shot Bets Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-bold text-gray-800">Rank</TableHead>
                <TableHead className="font-bold text-gray-800">Name</TableHead>
                <TableHead className="font-bold text-gray-800">
                  Shots On Others
                </TableHead>
                <TableHead className="font-bold text-gray-800">
                  Shots On Them
                </TableHead>
                <TableHead className="font-bold text-gray-800">
                  Net Shots
                </TableHead>
                <TableHead className="font-bold text-gray-800">
                  Bets Won
                </TableHead>
                <TableHead className="font-bold text-gray-800">
                  Bets Lost
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData
                .sort((a, b) => {
                  // Sort by net shots
                  const netA = a.totalShotsOwed - a.totalShotsOwedTo;
                  const netB = b.totalShotsOwed - b.totalShotsOwedTo;
                  return netB - netA;
                })
                .map((entry, index) => (
                  <TableRow
                    key={entry.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => navigate(`/users/${entry.id}`)}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell className="text-green-600">
                      <span className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        {entry.totalShotsOwed}
                      </span>
                    </TableCell>
                    <TableCell className="text-red-600">
                      <span className="flex items-center">
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                        {entry.totalShotsOwedTo}
                      </span>
                    </TableCell>
                    <TableCell
                      className={
                        entry.totalShotsOwed - entry.totalShotsOwedTo > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {entry.totalShotsOwed - entry.totalShotsOwedTo}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {entry.betsWon}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center text-red-600">
                        <XCircle className="h-4 w-4 mr-1" />
                        {entry.betsLost}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
