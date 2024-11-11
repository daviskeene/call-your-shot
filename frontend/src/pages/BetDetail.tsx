import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCallShot, useBet } from "@/api/hooks/useBets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Users, Clock, TrendingUp } from "lucide-react";
import ShotBetsLoading from "@/components/ui/ShotBetLoading";
import { Helmet } from "react-helmet";
import ShotBetsError from "@/components/ui/ShotBetError";

const BetDetailPage: React.FC = () => {
  const { betId: id } = useParams<{ betId: string }>();

  const betId = Number(id);

  // Fetch the bet data
  const { data: bet, isLoading, error } = useBet(betId);

  // Mutation to call the shot
  const callShotMutation = useCallShot(betId);

  // State for input shots
  const [shotsToCall, setShotsToCall] = useState<number | string>("");

  // Handle the call shot button click
  const handleCallShot = () => {
    if (bet) {
      const shots = parseInt(shotsToCall as string, 10);

      if (isNaN(shots) || shots <= 0 || shots > bet.shots) {
        alert("Please enter a valid number of shots between 1 and the total shots.");
        return;
      }

      const isComplete = shots === bet.shots;

      callShotMutation.mutate({
        outcome: isComplete ? new Date().toLocaleString() : "incomplete",
        shots: isComplete ? shots : bet.shots - shots,
      });
    }
  };

  // Default the input field value to bet.shots
  React.useEffect(() => {
    if (bet) {
      setShotsToCall(bet.shots);
    }
  }, [bet]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ShotBetsLoading />
      </div>
    );
  }

  if (error || !bet) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ShotBetsError onRetry={() => {
          // reload page
          window.location.reload();
        }}/>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-white">
      <Helmet>
        <title>Call Your Shot | Shot Details</title>
      </Helmet>
      <Card className="shadow-xl overflow-hidden mb-8">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <span>Shot Bet Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-800">
              {bet.description}
            </p>
            <p className="text-sm text-gray-600">
              Created on:{" "}
              {format(new Date(bet.date_created || ""), "MMM d, yyyy")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 border rounded-lg bg-white">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-500" />
                Shot Bet Sender
              </h2>
              <p className="text-md text-gray-700">{bet.bettor_name}</p>
            </div>

            <div className="p-4 border rounded-lg bg-white">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-500" />
                Shot Bet Receiver
              </h2>
              <p className="text-md text-gray-700">{bet.bettee_name}</p>
            </div>

            <div className="p-4 border rounded-lg bg-white">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Shots Left at Stake
              </h2>
              <p className="text-md text-gray-700">{bet.shots} shots</p>
            </div>

            <div className="p-4 border rounded-lg bg-white">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-500" />
                Outcome
              </h2>
              <p className="text-md text-gray-700">
                {bet.outcome
                  ? bet.outcome === "incomplete"
                    ? "Incomplete"
                    : `Called on: ${format(
                        new Date(bet.outcome),
                        "MMM d, yyyy, hh:mm a"
                      )}`
                  : "Pending"}
              </p>
            </div>
          </div>

          {(!bet.outcome || bet.outcome === "incomplete") && (
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-800 w-full md:w-auto">
              Number of shots to call:
            </label>
            <div className="flex flex-grow items-center space-x-4 w-full md:w-auto">
              <Input
                type="number"
                className="w-full md:flex-grow"
                value={shotsToCall}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(Number(e.target.value), bet.shots));
                  setShotsToCall(value);
                }}
              />
              <Button
                variant="default"
                className="w-full md:w-auto"
                onClick={handleCallShot}
                disabled={callShotMutation.isLoading}
              >
                {callShotMutation.isLoading ? "Calling..." : "Call Shots!"}
              </Button>
            </div>
          </div>
        )}
        {bet.outcome && bet.outcome !== "incomplete" && (
          <div className="text-center mt-4">
            <p className="text-lg font-bold text-green-600">Shot bet has been completed!</p>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BetDetailPage;