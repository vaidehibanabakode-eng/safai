import { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import SuperadminDashboard from './components/dashboards/SuperadminDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
// import GreenChampionDashboard from './components/dashboards/GreenChampionDashboard';
import WorkerDashboard from './components/dashboards/WorkerDashboard';
import CitizenDashboard from './components/dashboards/CitizenDashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';

export type UserRole = 'superadmin' | 'admin' | 'green-champion' | 'worker' | 'citizen';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

const LS_VIEW_KEY = 'currentView_safai';

type ViewState = 'landing' | 'login' | 'signup';

function App() {
  const { currentUser, userProfile, loading } = useAuth();

  const [currentView, setCurrentView] = useState<ViewState>(() => {
    return (localStorage.getItem(LS_VIEW_KEY) as ViewState) || 'landing';
  });

  const handleSetView = (view: ViewState) => {
    setCurrentView(view);
    localStorage.setItem(LS_VIEW_KEY, view);
  };

  const [localAuthFallback, setLocalAuthFallback] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    // TEMPORARY FALLBACK: keep passing prop until we remove all local states
    setLocalAuthFallback(user);
    handleSetView('login');
  };

  const handleLogout = async () => {
    setLocalAuthFallback(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleSetView('landing');
  };

  // Active User object to pass to dashboards (compat bridge)
  const activeUser: User | null = userProfile ? {
    id: userProfile.uid,
    email: userProfile.email,
    name: userProfile.name,
    role: userProfile.role.toLowerCase() as UserRole
  } : localAuthFallback;

  // Only show loading spinner if AuthContext is explicitly loading
  // Or if we have a Firebase user but haven't resolved their activeUser profile yet
  const isProfilePending = currentUser && !activeUser && !loading;

  if (loading || isProfilePending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!currentUser && !localAuthFallback) {
    switch (currentView) {
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToSignup={() => handleSetView('signup')}
            onBack={() => handleSetView('landing')}
          />
        );
      case 'signup':
        return (
          <SignupPage
            onSignupSuccess={(_email) => {
              handleSetView('login');
            }}
            onNavigateToLogin={() => handleSetView('login')}
          />
        );
      case 'landing':
      default:
        return <LandingPage onGetStarted={() => handleSetView('login')} />;
    }
  }

  const renderDashboard = () => {
    if (!activeUser) {
      // If we are logged out or missing profile data, fallback gracefully to login
      return (
        <LoginPage
          onLogin={handleLogin}
          onNavigateToSignup={() => handleSetView('signup')}
          onBack={() => handleSetView('landing')}
        />
      );
    }

    switch (activeUser.role) {
      case 'superadmin':
        return <SuperadminDashboard user={activeUser} onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard user={activeUser} onLogout={handleLogout} />;
      case 'worker':
        return <WorkerDashboard user={activeUser} onLogout={handleLogout} />;
      case 'citizen':
        return <CitizenDashboard user={activeUser} onLogout={handleLogout} />;
      default:
        // Fallback safety
        handleLogout();
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToSignup={() => handleSetView('signup')}
            onBack={() => handleSetView('landing')}
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
