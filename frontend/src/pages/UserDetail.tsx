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
import { Users, TrendingUp, Diamond } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import ShotBetsLoading from "@/components/ui/ShotBetLoading";
import { useNavigate, useParams } from "react-router-dom";
import { useUserShotBalances } from "@/api/hooks/useShotBalances";
import { Helmet } from "react-helmet";

// Define types for user-specific data

type Bet = {
  id: number;
  bettor_id: number;
  bettee_id: number;
  shots: number;
  outcome: string | null;
  date_created: string;
  description: string;
  bettor_name?: string;
  bettee_name?: string;
};

type UserDashboardProps = {};

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
    <CardContent className="bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <p className="text-2xl font-extrabold text-gray-900 mb-2">{value}</p>
      <p className="text-sm text-gray-600 mb-4">{subValue}</p>
      <div className="text-xs font-medium text-gray-500 flex items-center">
        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
        {trend}
      </div>
    </CardContent>
  </Card>
);

const UserShotBetsDashboard: React.FC<UserDashboardProps> = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useUserShotBalances(userId || "");

  const { user, bets_owed, bets_owned } = data || {
    user: { id: 0, name: "", email: "" },
    bets_owed: [],
    bets_owned: [],
  };

  // Calculate total shots owed and owned by the user
  const totalShotsOwed = useMemo(
    () => bets_owed.reduce((sum: number, bet: Bet) => sum + bet.shots, 0),
    [bets_owed],
  );

  const totalShotsOwned = useMemo(
    () => bets_owned.reduce((sum: number, bet: Bet) => sum + bet.shots, 0),
    [bets_owned],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ShotBetsLoading />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error.toString()}</div>;
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="min-h-screen pt-6">
      <Helmet>
        <title>Call Your Shot | {data.user.name}</title>
      </Helmet>
      <header className="bg-white text-left mb-8">
        <div className="w-100 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            {user.name} Shot Bets
          </h1>
          <Button
            variant="outline"
            aria-label="New Shot Bet"
            onClick={() => navigate(`/create-bet`)}
          >
            New Shot Bet
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        <StatCard
          title="Total Shots On Others"
          value={`${totalShotsOwed} shots`}
          subValue={`${bets_owed.length} outstanding bets`}
          icon={<Diamond className="h-8 w-8 text-purple-500" />}
          trend="Outstanding bets"
        />
        <StatCard
          title="Total Shots On Them"
          value={`${totalShotsOwned} shots`}
          subValue={`${bets_owned.length} owned bets`}
          icon={<Users className="h-8 w-8 text-indigo-500" />}
          trend="Owned bets"
        />
      </div>

      <Card className="shadow-2xl overflow-hidden mb-8">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
            <Diamond className="h-6 w-6" />
            <span>Shots On Others</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {bets_owed.length === 0 ? (
              <div className="text-center p-4 text-gray-700">
                {user.name} has no shots on others.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-bold text-gray-800">
                      To
                    </TableHead>
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
                  {bets_owed.map((bet: Bet, index: number) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => navigate(`/bets/${bet.id}`)}
                    >
                      <TableCell className="font-medium">
                        {bet.bettee_name}
                      </TableCell>
                      <TableCell>{bet.shots}</TableCell>
                      <TableCell>{bet.description}</TableCell>
                      <TableCell>{formatDate(bet.date_created)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            bet.outcome === "incomplete"
                              ? "bg-yellow-200 text-orange-900"
                              : bet.outcome
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {bet.outcome === "incomplete"
                            ? "Incomplete"
                            : bet.outcome || "Pending"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span>Shots On Them</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {bets_owned.length === 0 ? (
              <div className="text-center p-4 text-gray-700">
                {user.name} has no shots on them.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-bold text-gray-800">
                      From
                    </TableHead>
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
                  {bets_owned.map((bet: Bet, index: number) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => navigate(`/bets/${bet.id}`)}
                    >
                      <TableCell className="font-medium">
                        {bet.bettor_name}
                      </TableCell>
                      <TableCell>{bet.shots}</TableCell>
                      <TableCell>{bet.description}</TableCell>
                      <TableCell>{formatDate(bet.date_created)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            bet.outcome === "incomplete"
                              ? "bg-yellow-200 text-orange-900"
                              : bet.outcome
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {bet.outcome === "incomplete"
                            ? "Incomplete"
                            : bet.outcome || "Pending"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserShotBetsDashboard;
