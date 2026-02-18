import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, BarChart3, Users, Shield, Menu, X, ChevronRight, Globe, Recycle } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">

            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                    <div
                        onClick={() => scrollToSection('hero')}
                        className="flex items-center space-x-2 cursor-pointer group"
                    >
                        <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600">
                            Safai<span className="text-gray-800">Connect</span>
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        <button onClick={() => scrollToSection('features')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">Features</button>
                        <button onClick={() => scrollToSection('impact')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">Impact</button>
                        <button onClick={() => scrollToSection('cta')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">Solutions</button>
                        <button onClick={() => scrollToSection('about')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">About</button>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={onGetStarted}
                            className="px-5 py-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                            Log in
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-emerald-600 transition-colors bg-white/50 rounded-lg backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-2xl py-6 px-4 flex flex-col space-y-2 animate-in slide-in-from-top-2 duration-200 md:hidden">
                        <button onClick={() => scrollToSection('features')} className="text-left w-full py-3 px-4 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium transition-colors">Features</button>
                        <button onClick={() => scrollToSection('impact')} className="text-left w-full py-3 px-4 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium transition-colors">Impact</button>
                        <button onClick={() => scrollToSection('cta')} className="text-left w-full py-3 px-4 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium transition-colors">Solutions</button>
                        <button onClick={() => scrollToSection('about')} className="text-left w-full py-3 px-4 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium transition-colors">About</button>
                        <div className="h-px bg-gray-100 my-2"></div>
                        <button
                            onClick={onGetStarted}
                            className="w-full py-3 text-emerald-600 font-semibold rounded-xl bg-emerald-50"
                        >
                            Log In
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="w-full py-3 text-white bg-emerald-600 font-semibold rounded-xl shadow-lg"
                        >
                            Get Started Free
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-emerald-100 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Live in 50+ Cities</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Transforming Waste into <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
                                Sustainable Value
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            The all-in-one platform connecting citizens, workers, and administrators to build cleaner communities through smart tracking and real-time collaboration.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in zoom-in duration-700 delay-300">
                            <button
                                onClick={onGetStarted}
                                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Start for Free <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scrollToSection('features')}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-full font-bold text-lg hover:border-emerald-200 hover:text-emerald-700 transition-all flex items-center justify-center gap-2 hover:bg-emerald-50"
                            >
                                Watch Demo <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center"><div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-current border-b-[4px] border-b-transparent ml-0.5"></div></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section - Bento Style */}
            <section id="impact" className="py-12 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Citizens Engaged', value: '50,000+', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { label: 'Waste Collected', value: '1,200 Tons', icon: Recycle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            { label: 'Efficiency Boost', value: '45%', icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-50' },
                            { label: 'Active Zones', value: '120+', icon: Globe, color: 'text-orange-500', bg: 'bg-orange-50' },
                        ].map((stat, idx) => (
                            <div key={idx} className="p-6 rounded-3xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50 relative">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-emerald-600 font-semibold tracking-wide uppercase text-sm mb-3">Core Features</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Everything you need to manage waste smartly.</h3>
                        <p className="text-lg text-gray-600">Powerful tools tailored for every role in the ecosystem, designed to make cleanliness effortless.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform">
                                <BarChart3 className="w-7 h-7 text-blue-600" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-4">Real-time Analytics</h4>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Monitor collection routes, identify hotspots, and track resolution times with our advanced admin dashboard.
                            </p>
                            <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all cursor-pointer">
                                Learn more <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[4rem] -mr-8 -mt-8"></div>
                            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform relative z-10">
                                <Users className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">Community Action</h4>
                            <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
                                Empower citizens to report issues, track their resolution, and earn rewards for contributing to a cleaner city.
                            </p>
                            <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-2 transition-all cursor-pointer relative z-10">
                                Learn more <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform">
                                <Shield className="w-7 h-7 text-purple-600" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-4">Verified Impact</h4>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Ensure accountability with GPS-verified cleanups and transparent reporting for all stakeholders.
                            </p>
                            <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all cursor-pointer">
                                Learn more <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="py-24 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2626&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to make a difference?</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Join thousands of others who are already contributing to a cleaner, smarter, and more sustainable future.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="px-10 py-5 bg-emerald-500 text-white rounded-full font-bold text-xl hover:bg-emerald-400 transition-all shadow-2xl hover:shadow-emerald-500/20 hover:scale-105"
                    >
                        Join Safai Connect Today
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer id="about" className="bg-white border-t border-gray-100 pt-16 pb-8">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div>
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="bg-emerald-600 p-1.5 rounded-lg">
                                    <Leaf className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900">Safai Connect</span>
                            </div>
                            <p className="text-gray-500 leading-relaxed mb-6">
                                Building the infrastructure for the next generation of smart cities and waste management.
                            </p>
                            <div className="flex space-x-4 opacity-70">
                                {/* Social placeholders */}
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-600 transition-colors cursor-pointer">
                                    <Globe className="w-4 h-4" />
                                </div>
                                {/* Add more social icons here */}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-emerald-600 cursor-pointer transition-colors">Features</li>
                                <li className="hover:text-emerald-600 cursor-pointer transition-colors">Integrations</li>
                                <li className="hover:text-emerald-600 cursor-pointer transition-colors">Pricing</li>
                                <li className="hover:text-emerald-600 cursor-pointer transition-colors">Changelog</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-6">Company</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-emerald-600 cursor-pointer transition-colors">About Us</li>
                                <li className="hover:text-emerald-600 cursor-pointer transition-colors">Careers</li>
                                <li className="hover:text-emerald-600 cursor-pointer transition-colors">Blog</li>
                                <li className="hover:text-emerald-600 cursor-pointer transition-colors">Contact</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-emerald-600 cursor-pointer transition-colors">Privacy Policy</li>
                                <li className="hover:text-emerald-600 cursor-pointer transition-colors">Terms of Service</li>
                                <li className="hover:text-emerald-600 cursor-pointer transition-colors">Cookie Policy</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                        <div>&copy; {new Date().getFullYear()} Safai Connect. All rights reserved.</div>
                        <div className="flex gap-6">
                            <span className="hover:text-emerald-600 cursor-pointer">Privacy</span>
                            <span className="hover:text-emerald-600 cursor-pointer">Security</span>
                            <span className="hover:text-emerald-600 cursor-pointer">Sitemap</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
