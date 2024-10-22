import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "@/api/hooks/useUsers";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Search } from "lucide-react";
import ShotBetsLoading from "@/components/ui/ShotBetLoading";
import { Helmet } from "react-helmet";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: users, isLoading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered users based on search input
  const filteredUsers = useMemo(() => {
    if (!users || !searchTerm) return users || [];
    const lowercasedTerm = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedTerm) ||
        user.email.toLowerCase().includes(lowercasedTerm),
    );
  }, [users, searchTerm]);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle user selection
  const handleUserSelect = (userId: string | number) => {
    navigate(`/users/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ShotBetsLoading />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error loading users.</div>;
  }

  return (
    <>
      <Helmet>
        <title>Call Your Shot | Search</title>
      </Helmet>
      <div className="min-h-screen pt-8 bg-white text-left">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Search Users
          </h1>
          <p className="text-xl text-gray-600">
            Find users to view their shot bets.
          </p>
        </header>

        <div className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full p-6 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute right-4 top-3 h-6 w-6 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="cursor-pointer hover:shadow-2xl transition-shadow duration-200 transform hover:-translate-y-1"
                onClick={() => handleUserSelect(user.id)}
              >
                <CardHeader className="bg-white p-4 flex items-center">
                  <Users className="h-6 w-6 text-indigo-500 mr-2" />
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {user.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 mt-4">
              No users found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
