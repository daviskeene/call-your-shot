"use client";

import React from "react";
import { useNavigate } from "react-router-dom";

import { FilePlus, CheckCircle } from "lucide-react";
import { format, parseISO } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EventItem } from "@/api/hooks/useEvents";

const ShotBetsFeed: React.FC<{ events: EventItem[] | undefined }> = ({
  events,
}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4">
      {events?.map((event, index) => {
        const isBetCreation = event.type === "bet_creation";

        return (
          <React.Fragment key={event.id}>
            {/* A vertical connector line between events */}
            {index !== 0 && (
              <div className="flex flex-col items-center">
                <Separator className="h-8 w-1" />
              </div>
            )}

            <Card
              className={`relative mb-2 mt-2 shadow-md ${
                isBetCreation
                  ? "border-l-4 border-green-400"
                  : "border-l-4 border-blue-400"
              }`}
            >
              <CardHeader className="pb-1">
                <div className="flex items-left justify-between">
                  <CardTitle className="text-base">
                    {isBetCreation ? (
                      <span className="text-green-600 inline-flex items-center">
                        <FilePlus className="mr-2 h-4 w-4" />
                        Bet Created
                      </span>
                    ) : (
                      <span className="text-blue-600 inline-flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Bet Resolved
                      </span>
                    )}
                  </CardTitle>
                  <Badge variant="secondary">
                    {format(parseISO(event.event_date), "P")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-left text-md text-gray-700 mt-4 mb-4">
                  {event.description}
                </p>
                {isBetCreation && (
                  <p
                    className="text-right text-sm text-gray-500 mt-2 cursor-pointer"
                    onClick={() =>
                      navigate(`/bets/${event.id}`, { replace: true })
                    }
                  >
                    View Bet Details →
                  </p>
                )}
              </CardContent>
            </Card>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ShotBetsFeed;
