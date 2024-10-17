import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UserDetail from './pages/UserDetail';
import CreateBet from './pages/CreateBet';

const AppRoutes: React.FC = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users/:userId" element={<UserDetail />} />
        <Route path="/create-bet" element={<CreateBet />} />
        {/* Add more routes as needed */}
      </Routes>
    </Layout>
  </Router>
);

export default AppRoutes;
