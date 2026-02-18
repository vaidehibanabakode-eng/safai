import React, { useState } from 'react';
import { LogIn, ArrowLeft, Leaf, ShieldCheck, Mail, Lock } from 'lucide-react';
import { User } from '../App';
import { login } from '../utils/auth';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigateToSignup: () => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const user = login(email);

      if (user) {
        onLogin(user);
      } else {
        // FALLBACK for specific demo emails if not in local storage
        if (email === 'admin@safai.com') onLogin({ id: 'demo-admin', email, role: 'admin', name: 'Demo Admin' });
        else if (email === 'worker@safai.com') onLogin({ id: 'demo-worker', email, role: 'worker', name: 'Demo Worker' });
        else if (email === 'citizen@safai.com') onLogin({ id: 'demo-citizen', email, role: 'citizen', name: 'Demo Citizen' });
        else if (email === 'superadmin@safai.com') onLogin({ id: 'demo-superadmin', email, role: 'superadmin', name: 'Demo Super Admin' });
        else {
          setError('Invalid credentials. Please check your email or sign up.');
        }
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex w-1/2 bg-emerald-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-teal-900/90 z-10 mixture-blend-multiply"></div>
        <img
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Clean City"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 text-white p-12 max-w-lg">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Leaf className="w-8 h-8 text-emerald-300" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Safai Connect</span>
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Welcome Back, Hero.
          </h2>
          <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
            Log in to continue managing waste, tracking impact, and making your community cleaner and greener.
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-start space-x-4">
              <ShieldCheck className="w-8 h-8 text-emerald-300 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-1">Secure & Reliable</h4>
                <p className="text-sm text-emerald-100/80">Your data is protected with enterprise-grade security protocols.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right duration-500">
          <div className="text-center lg:text-left">
            <button
              onClick={onBack}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-gray-600">Please enter your details to access your dashboard.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-100 transform transition-all duration-200 shadow-lg hover:shadow-emerald-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600 mb-6">
              Don't have an account?{' '}
              <button
                onClick={onNavigateToSignup}
                className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Sign up now
              </button>
            </p>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">Quick Demo Access</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-600">
                <button
                  onClick={() => setEmail('superadmin@safai.com')}
                  className="p-2 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 transition-all text-center"
                >
                  Super Admin
                </button>
                <button
                  onClick={() => setEmail('admin@safai.com')}
                  className="p-2 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 transition-all text-center"
                >
                  Admin
                </button>
                <button
                  onClick={() => setEmail('worker@safai.com')}
                  className="p-2 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 transition-all text-center"
                >
                  Worker
                </button>
                <button
                  onClick={() => setEmail('citizen@safai.com')}
                  className="p-2 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 transition-all text-center"
                >
                  Citizen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;