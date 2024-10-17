import React from 'react';
import { useParams } from 'react-router-dom';
import { useUserShotBalances } from '../api/hooks/useShotBalances';

const UserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: shotBalances, isLoading, error } = useUserShotBalances(userId || '');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold">{shotBalances.user.name}</h2>
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Shot Balances</h3>
        {/* Display shot balances with other users */}
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Bets Made</h3>
        {/* List bets made by the user */}
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Bets Received</h3>
        {/* List bets made against the user */}
      </div>
    </div>
  );
};

export default UserDetail;
