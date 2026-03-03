import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Zap, 
  Rocket, 
  Calculator, 
  Target, 
  Users, 
  Wind,
  Trophy,
  Flame,
  Star,
  TrendingUp,
  Clock,
  Bell,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  Award,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LayoutDashboard,
  Gamepad2,
  BarChart3,
  UserCircle,
  Menu,
  X,
  Play
} from 'lucide-react';
import { CATEGORIES, BADGES, UserStats, Category } from './constants';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// --- Components ---

const ProgressBar: React.FC<{ progress: number, color?: string }> = ({ progress, color = 'bg-indigo-600' }) => (
  <div className="w-full bg-zinc-200 rounded-full h-3 border-2 border-zinc-900 overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-full ${color}`}
    />
  </div>
);

const StatCard: React.FC<{ icon: any, label: string, value: string | number, subValue?: string, color: string }> = ({ icon: Icon, label, value, subValue, color }) => (
  <motion.div 
    whileHover={{ scale: 1.05, rotate: 1 }}
    className="doodle-card p-5 flex flex-col gap-2 cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${color} bg-opacity-10 border border-zinc-900`}>
        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-sm font-bold text-zinc-600 uppercase tracking-tight">{label}</span>
    </div>
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-2xl font-black font-display">{value}</span>
      {subValue && (
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
          {subValue}
        </span>
      )}
    </div>
  </motion.div>
);

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showGames, setShowGames] = useState(false);
  
  return (
    <motion.div 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      className="doodle-card p-6 flex flex-col gap-4 cursor-pointer group relative overflow-hidden min-h-[400px]"
    >
      <div className="flex justify-between items-start z-10">
        <div className={`p-4 rounded-2xl ${category.color} text-white border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
          <category.icon className="w-8 h-8" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Reward</span>
          <div className="flex items-center gap-1 text-amber-500 font-black text-lg">
            <Star className="w-5 h-5 fill-current" />
            <span>{category.xpReward}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showGames ? (
          <motion.div 
            key="info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-4 flex-1"
          >
            <div className="relative h-32 flex items-center justify-center z-10">
              <motion.img 
                src={isHovered ? category.hoverAnimal : category.animal}
                alt={category.title}
                className="w-24 h-24 object-contain"
                animate={isHovered ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0],
                  y: [0, -10, 0]
                } : { scale: 1, rotate: 0, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  repeat: isHovered ? Infinity : 0,
                  repeatType: "mirror"
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="z-10">
              <h3 className="text-2xl font-black font-display group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                {category.title}
              </h3>
              <p className="text-sm text-zinc-600 font-medium mt-1 leading-tight">{category.description}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowGames(true); }}
              className="mt-auto doodle-btn py-2 text-sm uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" /> View Games
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="games"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-3 flex-1"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Available Games</h4>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowGames(false); }}
                className="text-[10px] font-black uppercase hover:underline"
              >
                Back
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {category.games.map(game => (
                <div key={game.id} className="p-3 bg-zinc-50 border-2 border-zinc-900 rounded-xl hover:bg-white transition-colors group/game">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">{game.name}</span>
                    <Play className="w-3 h-3 text-zinc-400 group-hover/game:text-indigo-600" />
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{game.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-4 z-10 border-t-2 border-zinc-100">
        <div className="flex justify-between text-[10px] font-black mb-2 tracking-widest text-zinc-400">
          <span>PROGRESS</span>
          <span className="text-zinc-900">{category.progress}%</span>
        </div>
        <ProgressBar progress={category.progress} color={category.color} />
      </div>
    </motion.div>
  );
};

// --- Auth Pages ---

const AuthPage = ({ type, onToggle }: { type: 'login' | 'signup', onToggle: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setError('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Secrets.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (type === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-zinc-50">
      <div className="doodle-bg-animated" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="doodle-card w-full max-w-md p-10 relative z-10 flex flex-col items-center gap-8"
      >
        {!isConfigured && (
          <div className="w-full p-4 bg-amber-50 border-2 border-amber-500 rounded-2xl text-amber-700 text-xs font-black flex flex-col gap-2 shadow-[4px_4px_0px_0px_rgba(245,158,11,0.2)]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="uppercase tracking-widest">Configuration Required</span>
            </div>
            <p className="leading-tight">
              You must set your Supabase URL and Anon Key in the <span className="underline">Secrets</span> panel to use authentication.
            </p>
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black font-display uppercase tracking-tighter">MindGym</h1>
          <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.2em]">
            {type === 'login' ? 'Welcome Back, Athlete' : 'Join the Gym'}
          </p>
        </div>

        {error && (
          <div className="w-full p-3 bg-rose-50 border-2 border-rose-500 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-zinc-50 border-2 border-zinc-900 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-zinc-50 border-2 border-zinc-900 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="doodle-btn w-full text-xl uppercase tracking-widest mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : type === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm font-bold text-zinc-500">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={onToggle} className="text-indigo-600 hover:underline">
            {type === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

// --- Sidebar ---

const Sidebar = ({ isOpen, onClose, onLogout }: { isOpen: boolean, onClose: () => void, onLogout: () => void }) => (
  <>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
        />
      )}
    </AnimatePresence>
    
    <motion.aside 
      initial={false}
      animate={{ x: isOpen ? 0 : -300 }}
      className="fixed top-0 left-0 h-full w-[280px] bg-white border-r-4 border-zinc-900 z-[70] p-6 flex flex-col gap-8 lg:translate-x-0 lg:static lg:h-auto lg:min-h-screen"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black font-display tracking-tighter uppercase">MindGym</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 hover:bg-zinc-100 rounded-xl">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {[
          { icon: LayoutDashboard, label: 'Dashboard', active: true },
          { icon: Gamepad2, label: 'Training Zones' },
          { icon: BarChart3, label: 'Analytics' },
          { icon: Trophy, label: 'Leaderboard' },
          { icon: UserCircle, label: 'Profile' },
          { icon: Settings, label: 'Settings' },
        ].map((item) => (
          <button 
            key={item.label}
            className={`flex items-center gap-4 p-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${item.active ? 'bg-indigo-500 text-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t-2 border-zinc-100">
        <button 
          onClick={onLogout}
          className="flex items-center gap-4 p-4 w-full rounded-2xl font-black uppercase tracking-widest text-sm text-rose-500 hover:bg-rose-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </motion.aside>
  </>
);

// --- Main App ---

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(2);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const stats: UserStats = {
    level: 5,
    xp: 2450,
    nextLevelXp: 3000,
    streak: 12,
    accuracy: 94,
    avgReactionTime: 245,
    brainScore: 842,
    consistency: 85,
    bestScore: 1240
  };

  const xpProgress = (stats.xp / stats.nextLevelXp) * 100;

  if (!session) {
    return <AuthPage type={authType} onToggle={() => setAuthType(authType === 'login' ? 'signup' : 'login')} />;
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'} transition-colors duration-300`}>
      <div className="doodle-bg-animated" />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onLogout={handleLogout} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-50 glass border-b-4 border-zinc-900 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 border-2 border-zinc-900 rounded-xl bg-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden lg:flex items-center gap-3">
                <Sparkles className="text-indigo-500 w-6 h-6" />
                <h2 className="text-xl font-black uppercase tracking-tighter">Dashboard</h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all bg-white text-zinc-900"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="relative">
                <button className="p-2.5 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all bg-white text-zinc-900">
                  <Bell className="w-5 h-5" />
                </button>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-zinc-900 text-[10px] font-black flex items-center justify-center text-white">
                    {notifications}
                  </span>
                )}
              </div>

              <div className="h-10 w-[2px] bg-zinc-900 mx-2" />

              <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black leading-none uppercase">{session.user.email?.split('@')[0]}</p>
                  <p className="text-[10px] text-zinc-500 font-black mt-1 uppercase tracking-widest">Level {stats.level}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden group-hover:translate-y-[-2px] transition-all">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`} 
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-10">
          
          {/* Top Section - Greeting & Overview */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-5xl font-black font-display uppercase tracking-tighter">👋 Welcome Back!</h2>
                <p className="text-zinc-500 font-black uppercase text-sm tracking-widest">Time to get those brain gains!</p>
              </div>

              <div className="doodle-card p-8 flex flex-col gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-32 h-32" />
                </div>
                
                <div className="flex justify-between items-center z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <Trophy className="text-indigo-600 w-10 h-10" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Current Rank</p>
                      <p className="text-2xl font-black font-display uppercase italic">Level {stats.level} – Thinker</p>
                    </div>
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-3 bg-amber-400 px-6 py-3 rounded-2xl border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Flame className="text-black w-8 h-8 fill-current" />
                    <span className="text-2xl font-black text-black">{stats.streak} DAY STREAK</span>
                  </motion.div>
                </div>
                
                <div className="space-y-4 z-10">
                  <div className="flex justify-between text-xs font-black tracking-widest">
                    <span className="text-zinc-500 uppercase">XP PROGRESSION</span>
                    <span className="text-zinc-900">{stats.xp} / {stats.nextLevelXp} XP</span>
                  </div>
                  <ProgressBar progress={xpProgress} color="bg-indigo-500" />
                  <div className="flex items-center justify-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4" />
                    <span>Only 550 XP left to reach Level 6!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Challenge Banner */}
            <div className="bg-yellow-400 rounded-[40px] p-8 text-black border-4 border-zinc-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/5 rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                <div className="bg-black text-white w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  Daily Quest
                </div>
                <h3 className="text-4xl font-black font-display uppercase leading-none mb-4">Beat 300ms Reaction Time</h3>
                <p className="text-black/70 font-bold text-sm mb-8 leading-tight uppercase">
                  Earn the legendary <span className="underline decoration-black decoration-2">Speed Demon</span> badge + 500 XP!
                </p>
              </div>
              <button className="doodle-btn w-full bg-black text-white hover:bg-zinc-800">
                Accept Quest
              </button>
            </div>
          </section>

          {/* Performance Snapshot */}
          <section className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-black font-display uppercase tracking-tight">Your Stats</h3>
              <button className="text-indigo-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
                Full Report <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <StatCard icon={Target} label="Accuracy" value={`${stats.accuracy}%`} subValue="+2.4%" color="bg-emerald-500" />
              <StatCard icon={Zap} label="Avg Reaction" value={`${stats.avgReactionTime}ms`} subValue="-12ms" color="bg-yellow-500" />
              <StatCard icon={Brain} label="Brain Score" value={stats.brainScore} subValue="+45" color="bg-indigo-500" />
              <StatCard icon={TrendingUp} label="Consistency" value={`${stats.consistency}%`} subValue="+5%" color="bg-sky-500" />
              <StatCard icon={Trophy} label="Best Score" value={stats.bestScore} color="bg-rose-500" />
            </div>
          </section>

          {/* Main Catalogue */}
          <section className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-black font-display uppercase tracking-tight">Training Zones</h3>
              <div className="h-1 flex-1 bg-zinc-900 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {CATEGORIES.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </section>

          {/* Bottom Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Rewards Section */}
            <div className="doodle-card p-8 flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black font-display uppercase">Badges</h3>
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <div className="grid grid-cols-4 gap-6">
                {BADGES.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center gap-3 group cursor-help">
                    <motion.div 
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center relative border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${badge.unlocked ? 'bg-white' : 'bg-zinc-100 grayscale'}`}
                    >
                      <badge.icon className={`w-8 h-8 ${badge.unlocked ? badge.color : 'text-zinc-300'}`} />
                      {!badge.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-2xl">
                          <Lock className="w-5 h-5 text-zinc-400" />
                        </div>
                      )}
                    </motion.div>
                    <span className={`text-[10px] font-black text-center uppercase tracking-tighter leading-none ${badge.unlocked ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-100 p-5 rounded-3xl border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Star className="text-yellow-500 w-8 h-8 fill-current" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black uppercase">Daily Loot!</p>
                  <p className="text-[10px] text-emerald-700 font-black uppercase tracking-widest">Claim 100 XP</p>
                </div>
                <button 
                  onClick={() => setShowConfetti(true)}
                  className="bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  Claim
                </button>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div className="doodle-card p-8 flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black font-display uppercase">Top Gym Rats</h3>
                <Users className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex flex-col gap-5">
                {[
                  { rank: 1, name: 'Sarah J.', score: 1420, avatar: 'Sarah' },
                  { rank: 2, name: 'Anubhav', score: 1240, avatar: 'Anubhav', isMe: true },
                  { rank: 3, name: 'Mike R.', score: 1190, avatar: 'Mike' },
                  { rank: 4, name: 'Elena K.', score: 1050, avatar: 'Elena' },
                  { rank: 5, name: 'Chris P.', score: 980, avatar: 'Chris' },
                  { rank: 6, name: 'Jessica W.', score: 940, avatar: 'Jessica' },
                ].map((user) => (
                  <div key={user.rank} className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all ${user.isMe ? 'bg-indigo-50 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent'}`}>
                    <span className={`w-8 text-center font-black text-lg ${user.rank === 1 ? 'text-yellow-500' : 'text-zinc-400'}`}>
                      #{user.rank}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border-2 border-zinc-900 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} alt={user.name} referrerPolicy="no-referrer" />
                    </div>
                    <span className={`flex-1 text-sm font-black uppercase ${user.isMe ? 'text-indigo-900' : 'text-zinc-700'}`}>
                      {user.name}
                    </span>
                    <span className="text-lg font-black font-display text-zinc-900">{user.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestion Box */}
            <div className="bg-zinc-900 p-8 rounded-[40px] text-white flex flex-col gap-8 shadow-[10px_10px_0px_0px_rgba(99,102,241,1)] border-4 border-zinc-900">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center border-2 border-white">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black font-display uppercase">Coach AI</h3>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1.5 h-auto bg-indigo-500 rounded-full" />
                  <p className="text-sm text-zinc-300 font-bold leading-tight uppercase">
                    "Yo! Your <span className="text-white font-black">reaction speed</span> is lagging. Hit the Reaction Zone to keep that edge sharp!"
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-auto bg-emerald-500 rounded-full" />
                  <p className="text-sm text-zinc-300 font-bold leading-tight uppercase">
                    "12 days straight? You're a <span className="text-emerald-400 font-black">beast</span>! Keep it up for 2 more days to unlock the 'Consistency King' title."
                  </p>
                </div>
              </div>
              <button className="mt-auto w-full bg-white text-black hover:bg-zinc-200 transition-colors py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                Get Custom Routine
              </button>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-16 border-t-4 border-zinc-900 mt-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                <Brain className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black font-display uppercase tracking-tighter">MindGym</span>
            </div>
            <div className="flex gap-10 text-xs font-black text-zinc-500 uppercase tracking-widest">
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
            </div>
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">© 2026 MindGym AI. Stay Sharp.</p>
          </div>
        </footer>
      </div>

      {/* Confetti Animation (Simplified) */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm"
            onClick={() => setShowConfetti(false)}
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-10 rounded-[40px] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] border-4 border-zinc-900 flex flex-col items-center gap-6 pointer-events-auto"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-500">
                <CheckCircle2 className="w-14 h-14 text-emerald-600" />
              </div>
              <div className="text-center">
                <h2 className="text-4xl font-black font-display uppercase">Loot Gained!</h2>
                <p className="text-zinc-500 font-black uppercase tracking-widest mt-2">+100 XP added to your stash</p>
              </div>
              <button 
                onClick={() => setShowConfetti(false)}
                className="doodle-btn w-full text-xl uppercase tracking-widest"
              >
                Sick!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
