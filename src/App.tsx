import { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfileSetupPage from './components/ProfileSetupPage';
import SuperadminDashboard from './components/dashboards/SuperadminDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import WorkerDashboard from './components/dashboards/WorkerDashboard';
import CitizenDashboard from './components/dashboards/CitizenDashboard';
import GreenChampionDashboard from './components/dashboards/GreenChampionDashboard';
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
  phone?: string;
  address?: string;
  citizenID?: string;
  assignedZone?: string;
  preferences?: {
    notifications?: boolean;
    language?: string;
  };
}

const LS_VIEW_KEY = 'currentView_safai';

type ViewState = 'landing' | 'login' | 'signup';

function App() {
  const { currentUser, userProfile, loading, profileIncomplete } = useAuth();

  const [currentView, setCurrentView] = useState<ViewState>(() => {
    return (localStorage.getItem(LS_VIEW_KEY) as ViewState) || 'landing';
  });

  const handleSetView = (view: ViewState) => {
    setCurrentView(view);
    localStorage.setItem(LS_VIEW_KEY, view);
  };

  const handleLogin = () => {
    // Login is handled entirely by Firebase/AuthContext now
    // No more localAuthFallback — the role comes from Firestore via AuthContext
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleSetView('landing');
  };

  // Show loading spinner while Firebase resolves the auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show public pages
  if (!currentUser) {
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

  // Logged in but Firestore profile is missing or incomplete → setup screen
  if (profileIncomplete) {
    return (
      <ThemeProvider>
        <ProfileSetupPage />
      </ThemeProvider>
    );
  }

  // Logged in but Firestore profile not loaded yet
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Build the activeUser from Firestore profile — this is the ONLY source of truth for role

  const activeUser: User = {
    id: userProfile.uid,
    email: userProfile.email,
    name: userProfile.name,
    // Normalize role to lowercase
    role: (userProfile.role?.toLowerCase() || 'citizen') as UserRole,
    phone: userProfile.phone,
    address: userProfile.address,
    citizenID: userProfile.citizenID,
    assignedZone: userProfile.assignedZone || userProfile.area,
    preferences: userProfile.preferences,
  };

  const renderDashboard = () => {
    switch (activeUser.role) {
      case 'superadmin': return <SuperadminDashboard user={activeUser} onLogout={handleLogout} />;
      case 'admin':      return <AdminDashboard user={activeUser} onLogout={handleLogout} />;
      case 'worker':          return <WorkerDashboard user={activeUser} onLogout={handleLogout} />;
      case 'green-champion':  return <GreenChampionDashboard user={activeUser} onLogout={handleLogout} />;
      default:                return <CitizenDashboard user={activeUser} onLogout={handleLogout} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 transition-colors duration-300">
        <div>
          {renderDashboard()}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
