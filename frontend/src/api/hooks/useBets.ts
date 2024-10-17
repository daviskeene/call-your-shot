import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { Bet } from '../../types/bet';

export const useCreateBet = () => {
    const queryClient = useQueryClient();
    return useMutation(
      (newBet: Omit<Bet, 'id' | 'date_created' | 'outcome'>) =>
        apiClient.post('/bets/', newBet),
      {
        onMutate: async (newBet) => {
          await queryClient.cancelQueries(['bets']);
          const previousBets = queryClient.getQueryData<Bet[]>(['bets']);
  
          queryClient.setQueryData<Bet[]>(['bets'], (old) => [
            ...(old || []),
            { id: Date.now(), ...newBet },
          ]);
  
          return { previousBets };
        },
        onError: (err, newBet, context) => {
          queryClient.setQueryData(['bets'], context?.previousBets);
        },
        onSettled: () => {
          queryClient.invalidateQueries(['bets']);
        },
      },
    );
  };
  
