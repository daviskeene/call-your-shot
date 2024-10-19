import React from "react";
import { User } from "../types/user";
import { Link } from "react-router-dom";

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Link to={`/users/${user.id}`}>
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p>Shots Owed: {user.totalShotsOwed}</p>
        <p>Shots Owed To: {user.totalShotsOwedTo}</p>
      </div>
    </Link>
  );
};

export default UserCard;
