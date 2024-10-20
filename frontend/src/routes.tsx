import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UserDetail from "./pages/UserDetail";
import CreateBet from "./pages/CreateBet";
import Leaderboard from "./pages/Leaderboard";
import SearchPage from "./pages/Search";
import BetDetailPage from "./pages/BetDetail";

const AppRoutes: React.FC = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users/:userId" element={<UserDetail />} />
        <Route path="/bets/:betId" element={<BetDetailPage />} />
        <Route path="/create-bet" element={<CreateBet />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Layout>
  </Router>
);

export default AppRoutes;
