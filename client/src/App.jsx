import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MobileContainer from './components/MobileContainer';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';
import { useAuth } from './context/AuthContext';

// Pages
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Statistics from './pages/Statistics';
import Day1_Setup from './pages/Day1_Setup';
import Day2_BioGenerator from './pages/Day2_BioGenerator';
import Day3_PhotoAnalysis from './pages/Day3_PhotoAnalysis';
import Day4_ChatCoach from './pages/Day4_ChatCoach';
import Day5_HashtagTool from './pages/Day5_HashtagTool';
import Day6_StoryCanvas from './pages/Day6_StoryCanvas';
import Day7_WeeklyReport from './pages/Day7_WeeklyReport';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Hide bottom nav on auth pages or specific flows if needed
  const showBottomNav = isAuthenticated && !['/login', '/register', '/'].includes(location.pathname);

  return (
    <MobileContainer>
      <div className="flex-1 relative">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/statistics" element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          } />

          <Route path="/day/1" element={<ProtectedRoute><Day1_Setup /></ProtectedRoute>} />
          <Route path="/day/2" element={<ProtectedRoute><Day2_BioGenerator /></ProtectedRoute>} />
          <Route path="/day/3" element={<ProtectedRoute><Day3_PhotoAnalysis /></ProtectedRoute>} />
          <Route path="/day/4" element={<ProtectedRoute><Day4_ChatCoach /></ProtectedRoute>} />
          <Route path="/day/5" element={<ProtectedRoute><Day5_HashtagTool /></ProtectedRoute>} />
          <Route path="/day/6" element={<ProtectedRoute><Day6_StoryCanvas /></ProtectedRoute>} />
          <Route path="/day/7" element={<ProtectedRoute><Day7_WeeklyReport /></ProtectedRoute>} />
        </Routes>
      </div>
      {showBottomNav && <BottomNav />}
    </MobileContainer>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
