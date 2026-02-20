import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import SuperadminDashboard from './components/dashboards/SuperadminDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
// import GreenChampionDashboard from './components/dashboards/GreenChampionDashboard';
import WorkerDashboard from './components/dashboards/WorkerDashboard';
import CitizenDashboard from './components/dashboards/CitizenDashboard';
import { ThemeProvider } from './contexts/ThemeContext';
// import { SpeedInsights } from "@vercel/speed-insights/next";

export type UserRole = 'superadmin' | 'admin' | 'green-champion' | 'worker' | 'citizen';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

const LS_KEY = 'currentUser';

type ViewState = 'landing' | 'login' | 'signup';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  // Rehydrate from localStorage on first render
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(LS_KEY, JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing'); // Reset to landing page on logout
    localStorage.removeItem(LS_KEY);
  };

  if (!currentUser) {
    switch (currentView) {
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToSignup={() => setCurrentView('signup')}
            onBack={() => setCurrentView('landing')}
          />
        );
      case 'signup':
        return (
          <SignupPage
            onSignupSuccess={(_email) => {
              // Auto-fill email in login or just go to login?
              // Let's go to Login
              setCurrentView('login');
              // Optional: Show success toast (not implemented yet, simple flow for now)
            }}
            onNavigateToLogin={() => setCurrentView('login')}
          // onBack={() => setCurrentView('landing')} // Signup usually has back to login
          />
        );
      case 'landing':
      default:
        return <LandingPage onGetStarted={() => setCurrentView('login')} />;
    }
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'superadmin':
        return <SuperadminDashboard user={currentUser} onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
      // case 'green-champion':
      //   return <GreenChampionDashboard user={currentUser} onLogout={handleLogout} />;
      case 'worker':
        return <WorkerDashboard user={currentUser} onLogout={handleLogout} />;
      case 'citizen':
        return <CitizenDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        // Fallback safety: clear bad state and show login
        localStorage.removeItem(LS_KEY);
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToSignup={() => setCurrentView('signup')}
            onBack={() => setCurrentView('landing')}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 transition-colors duration-300">
        {renderDashboard()}
      </div>
    </ThemeProvider>
  );
}

export default App;
