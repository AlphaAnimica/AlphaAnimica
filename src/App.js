import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import CreateOpportunity from './pages/CreateOpportunity';
import TraineeProfileView from './pages/TraineeProfileView';
import EditOpportunity from './pages/EditOpportunity';
import ClinicProfileView from './pages/ClinicProfileView';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

const PrivateRoute = ({ children, allowedUserTypes = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user.userType)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className={user ? 'pt-16' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunities/:id" element={<OpportunityDetail />} />
          <Route path="/opportunities/:id/edit" element={<EditOpportunity />} />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/applications" 
            element={
              <PrivateRoute>
                <Applications />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/create-opportunity" 
            element={
              <PrivateRoute allowedUserTypes={['clinic']}>
                <CreateOpportunity />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/trainee/:id" 
            element={<TraineeProfileView />} 
          />
          
          <Route 
            path="/clinic/:id" 
            element={<ClinicProfileView />} 
          />

          <Route 
            path="/admin" 
            element={
              <PrivateRoute allowedUserTypes={['admin']}>
                <Admin />
              </PrivateRoute>
            } 
          />

          <Route path="/adminlogin" element={<AdminLogin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 