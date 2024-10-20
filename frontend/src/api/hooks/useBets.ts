import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { Bet } from "../../types/bet";

export const useBet = (betId: number) => {
  return useQuery<Bet>(["bets", betId], () => apiClient.get(`/bets/${betId}`), {
    staleTime: 1000 * 60 * 5,
  });
};

export const useCallShot = (betId: number) => {
  const queryClient = useQueryClient();
  return useMutation(
    (
      newBet: Omit<
        Bet,
        "id" | "date_created" | "bettor_id" | "bettee_id" | "shots"
      >,
    ) => apiClient.put(`/bets/${betId}`, newBet),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(["bets", betId]);
        const previousBet = queryClient.getQueryData<Bet>(["bets", betId]);

        queryClient.setQueryData<Bet>(["bets", betId], (old) => ({
          ...old!,
          outcome: new Date().toLocaleString(),
        }));

        return { previousBet };
      },
      onError: (err, _, context) => {
        queryClient.setQueryData(["bets", betId], context?.previousBet);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["bets", betId]);
      },
    },
  );
};

export const useCreateBet = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (newBet: Omit<Bet, "id" | "date_created" | "outcome">) =>
      apiClient.post("/bets/", newBet),
    {
      onMutate: async (newBet) => {
        await queryClient.cancelQueries(["bets"]);
        const previousBets = queryClient.getQueryData<Bet[]>(["bets"]);

        queryClient.setQueryData<Bet[]>(["bets"], (old) => [
          ...(old || []),
          { id: Date.now(), ...newBet },
        ]);

        return { previousBets };
      },
      onError: (err, newBet, context) => {
        queryClient.setQueryData(["bets"], context?.previousBets);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["bets"]);
      },
    },
  );
};
