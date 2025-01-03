import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import { format } from "date-fns";
import { Notebook } from "lucide-react";

import { useShotBalances } from "@/api/hooks/useShotBalances";
import { getColorClass } from "@/components/ShotBetsDashboard";
import ShotBetsLoading from "@/components/ui/ShotBetLoading";
import ShotBetsError from "@/components/ui/ShotBetError";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM d, yyyy");
};

const Log: React.FC = () => {
  const query = useShotBalances();
  const navigate = useNavigate();

  const { nodes, edges } = query.data || {
    nodes: [],
    edges: [],
  };

  const nodeMap = useMemo(() => {
    return nodes.reduce(
      (acc, node) => {
        acc[node.id] = node.name;
        return acc;
      },
      {} as Record<number, string>,
    );
  }, [nodes]);

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
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Record Log</title>
      </Helmet>
      <Card className="shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
            <Notebook className="h-6 w-6" />
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
                {edges
                  .sort((a, b) => {
                    return (
                      new Date(b.dateCreated).getTime() -
                      new Date(a.dateCreated).getTime()
                    );
                  })
                  .map((edge, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => navigate(`/bets/${edge.id}`)}
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
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getColorClass(
                            edge.outcome,
                          )}`}
                        >
                          {edge.outcome === "incomplete"
                            ? "Incomplete"
                            : edge.outcome?.split("T")[0] || "Pending"}
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

export default Log;
