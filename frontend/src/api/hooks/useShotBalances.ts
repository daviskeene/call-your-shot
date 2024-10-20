import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";

type GraphDataResponse = {
  nodes: {
    id: number;
    name: string;
  }[];
  edges: {
    from: number;
    to: number;
    value: number;
    reason: string;
    outcome: string | null;
    dateCreated: string;
    id: number;
  }[];
  leaderboard: {
    id: number;
    name: string;
    totalShotsOwed: number;
    totalShotsOwedTo: number;
  }[];
};

export const useShotBalances = () => {
  return useQuery<GraphDataResponse>(
    ["shotBalances"],
    () => apiClient.get("/data/graph"),
    {
      staleTime: 1000 * 60 * 5,
    },
  );
};

export const useUserShotBalances = (userId: string) => {
  return useQuery(
    ["userShotBalances", userId],
    () => apiClient.get(`/users/${userId}/bet-summary`),
    {
      staleTime: 1000 * 60 * 5,
    },
  );
};

export const useShotRelationships = () => {
  return useQuery<GraphDataResponse>(
    ["shotRelationships"],
    () => apiClient.get("/data/graph"),
    {
      staleTime: 1000 * 60 * 5,
    },
  );
};
