import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";

// Example type definition matching your event JSON
export type EventItem = {
  id: number;
  type: "bet_creation" | "bet_resolution";
  event_date: string; // ISO string
  description: string;
};

export const useEvents = () => {
  return useQuery(["events"], () => apiClient.get(`/data/events`), {
    staleTime: 1000 * 60 * 5,
  });
};
