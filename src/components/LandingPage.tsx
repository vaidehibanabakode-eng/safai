import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowRight, BarChart3, Users, Shield, Menu, X, Globe,
    Recycle, Download, MapPin, Bell, CheckCircle, Zap, Star,
    ChevronDown, Smartphone, Lock, TrendingUp,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
    onGetStarted: () => void;
}

/* ---------- tiny counter hook ---------- */
function useCounter(target: number, duration = 2000, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        const step = (ts: number) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);
    return count;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef<HTMLDivElement>(null);
    const { isInstallable, installApp } = usePWAInstall();
    const { t } = useLanguage();

    const c1 = useCounter(50000, 2000, statsVisible);
    const c2 = useCounter(1200, 2000, statsVisible);
    const c3 = useCounter(45, 2000, statsVisible);
    const c4 = useCounter(120, 2000, statsVisible);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
            { threshold: 0.3 }
        );
        if (statsRef.current) obs.observe(statsRef.current);
        return () => obs.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    const handleInstall = () => {
        if (isInstallable) {
            installApp();
        } else {
            alert('To install SafaiConnect:\n\nDesktop: Click the install icon in your address bar.\nMobile: Tap "Share" → "Add to Home Screen".');
        }
    };

    // Data structures with translations
    const navItems = [
        { id: 'features', label: t('nav_features') },
        { id: 'impact', label: t('nav_impact') },
        { id: 'solutions', label: t('nav_solutions') },
        { id: 'about', label: t('nav_about') },
    ];

    const stats = [
        { label: t('stat_citizens'), value: c1.toLocaleString(), suffix: '+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: t('stat_waste'), value: c2.toLocaleString(), suffix: '+', icon: Recycle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: t('stat_efficiency'), value: c3, suffix: '%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: t('stat_zones'), value: c4, suffix: '+', icon: Globe, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    const roles = [
        {
            role: t('role_citizens'),
            emoji: '🏘️',
            bg: 'bg-white',
            border: 'border-blue-100',
            accent: 'text-blue-600',
            btnClass: 'text-blue-700 bg-blue-50 hover:bg-blue-100',
            perks: [t('perk_citizen_report'), t('perk_citizen_track'), t('perk_citizen_book'), t('perk_citizen_earn')],
        },
        {
            role: t('role_workers'),
            emoji: '👷',
            bg: 'bg-white',
            border: 'border-emerald-100',
            accent: 'text-emerald-600',
            btnClass: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100',
            perks: [t('perk_worker_tasks'), t('perk_worker_proof'), t('perk_worker_attendance'), t('perk_worker_training')],
        },
        {
            role: t('role_admins'),
            emoji: '📊',
            bg: 'bg-white',
            border: 'border-purple-100',
            accent: 'text-purple-600',
            btnClass: 'text-purple-700 bg-purple-50 hover:bg-purple-100',
            perks: [t('perk_admin_manage'), t('perk_admin_monitor'), t('perk_admin_salary'), t('perk_admin_verify')],
        },
        {
            role: t('role_superadmins'),
            emoji: '🛡️',
            bg: 'bg-white',
            border: 'border-amber-100',
            accent: 'text-amber-600',
            btnClass: 'text-amber-700 bg-amber-50 hover:bg-amber-100',
            perks: [t('perk_superadmin_overview'), t('perk_superadmin_manage'), t('perk_superadmin_inventory'), t('perk_superadmin_analytics')],
        },
    ];

    const features = [
        { icon: MapPin, title: t('feat_geo_title'), desc: t('feat_geo_desc'), color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { icon: Bell, title: t('feat_notif_title'), desc: t('feat_notif_desc'), color: 'text-blue-600', bg: 'bg-blue-50' },
        { icon: Shield, title: t('feat_role_title'), desc: t('feat_role_desc'), color: 'text-purple-600', bg: 'bg-purple-50' },
        { icon: Smartphone, title: t('feat_offline_title'), desc: t('feat_offline_desc'), color: 'text-orange-600', bg: 'bg-orange-50' },
        { icon: BarChart3, title: t('feat_analytics_title'), desc: t('feat_analytics_desc'), color: 'text-pink-600', bg: 'bg-pink-50' },
        { icon: Lock, title: t('feat_secure_title'), desc: t('feat_secure_desc'), color: 'text-teal-600', bg: 'bg-teal-50' },
        { icon: Users, title: t('feat_multi_title'), desc: t('feat_multi_desc'), color: 'text-amber-600', bg: 'bg-amber-50' },
        { icon: Zap, title: t('feat_voice_title'), desc: t('feat_voice_desc'), color: 'text-cyan-600', bg: 'bg-cyan-50' },
        { icon: Star, title: t('feat_reward_title'), desc: t('feat_reward_desc'), color: 'text-yellow-600', bg: 'bg-yellow-50' },
    ];

    const footerCols = [
        { heading: t('footer_platform'), links: [t('link_features'), t('link_roles'), t('link_pricing'), t('link_changelog')] },
        { heading: t('footer_company'), links: [t('link_about'), t('link_careers'), t('link_blog'), t('link_contact')] },
        { heading: t('footer_legal'), links: [t('link_privacy'), t('link_terms'), t('link_cookie')] },
    ];

    // Footer bottom links
    const footerBottomLinks = [t('link_privacy'), t('link_security'), t('link_sitemap')];


    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">

            {/* ─── NAV ─── */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                    {/* Logo */}
                    <div onClick={() => scrollTo('hero')} className="flex items-center gap-2.5 cursor-pointer group">
                        <img src="/logo.png" alt="Safai Connect Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
                    </div>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollTo(item.id)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={handleInstall} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">
                            <Download className="w-4 h-4" /> {t('nav_install')}
                        </button>
                        <button onClick={onGetStarted} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors">
                            Log in
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-5 py-2.5 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-1.5"
                        >
                            {t('nav_get_started')} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-emerald-600 bg-white/50 backdrop-blur-sm rounded-lg"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl py-4 px-4 flex flex-col gap-2 md:hidden">
                        {navItems.map((item) => (
                            <button key={item.id} onClick={() => scrollTo(item.id)} className="text-left py-3 px-4 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl capitalize font-medium transition-colors">
                                {item.label}
                            </button>
                        ))}
                        <div className="h-px bg-gray-100 my-1" />
                        <button onClick={handleInstall} className="w-full py-3 text-emerald-600 font-semibold rounded-xl bg-emerald-50 flex items-center justify-center gap-2">
                            <Download className="w-5 h-5" /> {t('hero_install_btn')}
                        </button>
                        <button onClick={onGetStarted} className="w-full py-3 text-white font-bold rounded-xl bg-gray-900 shadow-lg">
                            {t('hero_get_started_btn')}
                        </button>
                    </div>
                )}
            </nav>

            {/* ─── HERO ─── */}
            <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">
                {/* Background Blobs (Light Mode) */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                    <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-teal-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-cyan-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-100 bg-white shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">{t('hero_badge')}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.05] mb-6 text-gray-900 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        {t('hero_title_1')}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
                            {t('hero_title_2')}
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        {t('hero_subtitle')}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in zoom-in duration-700 delay-300">
                        <button
                            onClick={onGetStarted}
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            {t('hero_get_started_btn')} <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleInstall}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-100 rounded-full font-bold text-lg hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                        >
                            <Download className="w-5 h-5" /> {t('hero_install_btn')}
                        </button>
                    </div>

                    {/* Trusted by */}
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-6 opacity-60 animate-in fade-in duration-700 delay-500">
                        {['Indore', 'Surat', 'Navi Mumbai', 'Delhi', 'Bangalore'].map((city) => (
                            <div key={city} className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                {city}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <button
                    onClick={() => scrollTo('impact')}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 hover:text-emerald-600 transition-colors animate-bounce"
                >
                    <span className="text-xs font-medium">{t('hero_scroll')}</span>
                    <ChevronDown className="w-5 h-5" />
                </button>
            </section>

            {/* ─── STATS ─── */}
            <section id="impact" className="py-20 bg-white border-y border-gray-100">
                <div ref={statsRef} className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className="group p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                                    {stat.value}<span className={`text-xl ${stat.color}`}>{stat.suffix}</span>
                                </div>
                                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── ROLE CARDS ─── */}
            <section id="solutions" className="py-24 px-4 bg-gray-50">
                <div className="container mx-auto md:px-8">
                    <div className="text-center mb-16">
                        <p className="text-emerald-600 text-sm font-bold uppercase tracking-widest mb-3">{t('roles_built_for')}</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('roles_title')}</h2>
                        <p className="text-gray-600 text-lg max-w-xl mx-auto">{t('roles_subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {roles.map((card) => (
                            <div
                                key={card.role}
                                className={`${card.bg} border ${card.border} rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1`}
                            >
                                <div className="text-4xl mb-6">{card.emoji}</div>
                                <h3 className={`text-2xl font-bold mb-4 ${card.accent}`}>{card.role}</h3>
                                <ul className="space-y-3 mb-8">
                                    {card.perks.map((p) => (
                                        <li key={p} className="flex items-start gap-3 text-gray-600 text-sm font-medium">
                                            <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${card.accent}`} />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={onGetStarted}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm ${card.btnClass} transition-all`}
                                >
                                    {t('access_dashboard')} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section id="features" className="py-24 px-4 relative bg-white border-t border-gray-100">
                <div className="container mx-auto md:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <p className="text-emerald-600 text-sm font-bold uppercase tracking-widest mb-3">{t('features_core')}</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('features_title')}</h2>
                        <p className="text-gray-600 text-lg max-w-xl mx-auto">{t('features_subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-xl rounded-[2rem] p-8 transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                                    <f.icon className={`w-7 h-7 ${f.color}`} />
                                </div>
                                <h4 className="text-gray-900 font-bold text-xl mb-3">{f.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section id="cta" className="py-32 px-4 relative overflow-hidden bg-gray-900">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="container mx-auto md:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-8 backdrop-blur-md">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{t('cta_badge')}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        {t('cta_title_1')}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{t('cta_title_2')}</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
                        {t('cta_subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onGetStarted}
                            className="px-10 py-5 bg-emerald-500 text-white rounded-full font-bold text-xl hover:bg-emerald-400 transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                        >
                            {t('cta_get_started')} <ArrowRight className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleInstall}
                            className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-full font-bold text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                        >
                            <Download className="w-6 h-6 text-emerald-400" /> {t('hero_install_btn')}
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="bg-white pt-16 pb-8 px-4 border-t border-gray-100">
                <div className="container mx-auto md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => scrollTo('hero')}>
                                <img src="/logo.png" alt="Safai Connect Logo" className="h-10 w-auto object-contain" />
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {t('footer_tagline')}
                            </p>
                        </div>
                        {footerCols.map((col) => (
                            <div key={col.heading}>
                                <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">{col.heading}</h4>
                                <ul className="space-y-3 text-gray-500 text-sm">
                                    {col.links.map((l) => (
                                        <li key={l} className="hover:text-emerald-600 cursor-pointer transition-colors">{l}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                        <div>© {new Date().getFullYear()} {t('footer_rights')}</div>
                        <div className="flex gap-6">
                            {footerBottomLinks.map((l) => (
                                <span key={l} className="hover:text-emerald-600 cursor-pointer transition-colors">{l}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
