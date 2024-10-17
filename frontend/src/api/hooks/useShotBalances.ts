import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

type GraphDataResponse = {
    edges: {
        id: number;
        name: string;
    }[];
    nodes: {
        from: number;
        to: number;
        value: number;
    }[];
    leaderboard: {
        id: number;
        name: string;
        totalShotsOwed: number;
        totalShotsOwedTo: number;
    }[];
};


export const useShotBalances = () => {
  return useQuery<GraphDataResponse>(['shotBalances'], () =>
    apiClient.get('/data/graph'),
  );
};

export const useUserShotBalances = (userId: string) => {
  return useQuery(['userShotBalances', userId], () =>
    apiClient.get(`/users/${userId}/shot-balances`),
  );
};

export const useShotRelationships = () => {
  return useQuery<GraphDataResponse>(['shotRelationships'], () =>
    apiClient.get('/data/graph'),
  );
};
