import React, { useState } from 'react';
import { UserPlus, ArrowLeft, Leaf, CheckCircle } from 'lucide-react';
import { UserRole } from '../App';
import { register } from '../utils/auth';

interface SignupPageProps {
    onSignupSuccess: (email: string) => void;
    onNavigateToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onNavigateToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole | ''>('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!role) {
            setError('Please select a role');
            setIsLoading(false);
            return;
        }

        // Simulate network delay for better UX
        setTimeout(() => {
            const newUser = {
                id: `${role}-${Date.now()}`,
                email,
                role,
                name,
            };

            const success = register(newUser);
            if (success) {
                onSignupSuccess(email);
            } else {
                setError('User with this email already exists');
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
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2626&q=80"
                    alt="Sustainable Future"
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
                        Join the Movement for a Cleaner World.
                    </h2>
                    <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
                        Create an account to access advanced waste management tools, track progress in real-time, and contribute to a sustainable future.
                    </p>

                    <div className="space-y-4">
                        {[
                            "Real-time waste tracking",
                            "Role-based dashboards",
                            "Community engagement tools"
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-3 text-emerald-50">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
                <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right duration-500">
                    <div className="text-center lg:text-left">
                        <button
                            onClick={onNavigateToLogin}
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </button>
                        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-gray-600">Enter your details to register.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Role</label>
                                <div className="relative">
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as UserRole)}
                                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none appearance-none"
                                        required
                                    >
                                        <option value="">Choose a role...</option>
                                        <option value="superadmin">Super Admin</option>
                                        <option value="admin">Admin</option>
                                        <option value="green-champion">Green Champion</option>
                                        <option value="worker">Worker</option>
                                        <option value="citizen">Citizen</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                    </div>
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
                                    <UserPlus className="w-5 h-5" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                            onClick={onNavigateToLogin}
                            className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
