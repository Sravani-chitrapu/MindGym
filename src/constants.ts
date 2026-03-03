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
  Lock
} from 'lucide-react';

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  accuracy: number;
  avgReactionTime: number;
  brainScore: number;
  consistency: number;
  bestScore: number;
}

export interface Game {
  id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  xpReward: number;
  color: string;
  animal?: string;
  hoverAnimal?: string;
  games: Game[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'brain',
    title: 'Brain',
    description: 'Memory, Logic, Pattern games',
    icon: Brain,
    progress: 65,
    xpReward: 150,
    color: 'bg-indigo-500',
    animal: 'https://api.dicebear.com/7.x/bottts/svg?seed=brainy&backgroundColor=b6e3f4',
    hoverAnimal: 'https://api.dicebear.com/7.x/bottts/svg?seed=brainy&backgroundColor=ffdfbf',
    games: [
      { id: 'b1', name: 'Memory Matrix', description: 'Recall patterns on a grid' },
      { id: 'b2', name: 'Logic Links', description: 'Connect logical sequences' },
      { id: 'b3', name: 'Pattern Pulse', description: 'Identify complex patterns' },
      { id: 'b4', name: 'Word Warp', description: 'Anagram and vocabulary challenges' }
    ]
  },
  {
    id: 'reaction',
    title: 'Reaction',
    description: 'Improve your reflexes',
    icon: Zap,
    progress: 40,
    xpReward: 100,
    color: 'bg-yellow-500',
    animal: 'https://api.dicebear.com/7.x/bottts/svg?seed=fast&backgroundColor=ffdfbf',
    hoverAnimal: 'https://api.dicebear.com/7.x/bottts/svg?seed=fast&backgroundColor=b6e3f4',
    games: [
      { id: 'r1', name: 'Flash Click', description: 'Click when the screen changes color' },
      { id: 'r2', name: 'Target Tagger', description: 'Hit moving targets quickly' },
      { id: 'r3', name: 'Sound Snap', description: 'React to auditory cues' }
    ]
  },
  {
    id: 'speed',
    title: 'Speed',
    description: 'Process information faster',
    icon: Rocket,
    progress: 80,
    xpReward: 120,
    color: 'bg-emerald-500',
    animal: 'https://api.dicebear.com/7.x/bottts/svg?seed=speedy&backgroundColor=d1d4f9',
    hoverAnimal: 'https://api.dicebear.com/7.x/bottts/svg?seed=speedy&backgroundColor=ffdfbf',
    games: [
      { id: 's1', name: 'Rapid Reader', description: 'Scan and find keywords fast' },
      { id: 's2', name: 'Sort Sprint', description: 'Categorize items under pressure' },
      { id: 's3', name: 'Match Mania', description: 'Find pairs in record time' }
    ]
  },
  {
    id: 'math',
    title: 'Math',
    description: 'Mental arithmetic & logic',
    icon: Calculator,
    progress: 30,
    xpReward: 200,
    color: 'bg-rose-500',
    animal: 'https://api.dicebear.com/7.x/bottts/svg?seed=math&backgroundColor=ffdfbf',
    hoverAnimal: 'https://api.dicebear.com/7.x/bottts/svg?seed=math&backgroundColor=d1d4f9',
    games: [
      { id: 'm1', name: 'Sum Slider', description: 'Solve addition puzzles' },
      { id: 'm2', name: 'Factor Flow', description: 'Identify factors of large numbers' },
      { id: 'm3', name: 'Equation Escape', description: 'Solve for X quickly' }
    ]
  },
  {
    id: 'focus',
    title: 'Focus',
    description: 'Concentration exercises',
    icon: Target,
    progress: 55,
    xpReward: 130,
    color: 'bg-sky-500',
    animal: 'https://api.dicebear.com/7.x/bottts/svg?seed=focus&backgroundColor=b6e3f4',
    hoverAnimal: 'https://api.dicebear.com/7.x/bottts/svg?seed=focus&backgroundColor=ffdfbf',
    games: [
      { id: 'f1', name: 'Zen Zone', description: 'Maintain focus on a single point' },
      { id: 'f2', name: 'Distraction Dodge', description: 'Ignore moving obstacles' },
      { id: 'f3', name: 'Detail Detective', description: 'Find subtle differences' }
    ]
  },
  {
    id: 'multiplayer',
    title: 'Multiplayer',
    description: 'Challenge your friends',
    icon: Users,
    progress: 0,
    xpReward: 250,
    color: 'bg-purple-500',
    animal: 'https://api.dicebear.com/7.x/bottts/svg?seed=friends&backgroundColor=ffdfbf',
    hoverAnimal: 'https://api.dicebear.com/7.x/bottts/svg?seed=friends&backgroundColor=b6e3f4',
    games: [
      { id: 'mp1', name: 'Brain Brawl', description: '1v1 logic battle' },
      { id: 'mp2', name: 'Speed Race', description: 'Who can finish the task first?' },
      { id: 'mp3', name: 'Math Duel', description: 'Arithmetic face-off' }
    ]
  },
  {
    id: 'relax',
    title: 'Mind Relax',
    description: 'Meditation & mindfulness',
    icon: Wind,
    progress: 90,
    xpReward: 50,
    color: 'bg-teal-500',
    animal: 'https://api.dicebear.com/7.x/bottts/svg?seed=relax&backgroundColor=d1d4f9',
    hoverAnimal: 'https://api.dicebear.com/7.x/bottts/svg?seed=relax&backgroundColor=ffdfbf',
    games: [
      { id: 'rl1', name: 'Breathe Deep', description: 'Guided breathing session' },
      { id: 'rl2', name: 'Cloud Watch', description: 'Visual relaxation exercise' },
      { id: 'rl3', name: 'Nature Notes', description: 'Ambient soundscape focus' }
    ]
  }
];

export const BADGES = [
  { id: 1, name: 'Early Bird', icon: Award, unlocked: true, color: 'text-amber-500' },
  { id: 2, name: 'Math Whiz', icon: Calculator, unlocked: true, color: 'text-blue-500' },
  { id: 3, name: 'Speed Demon', icon: Zap, unlocked: false, color: 'text-gray-400' },
  { id: 4, name: 'Focus Master', icon: Target, unlocked: false, color: 'text-gray-400' },
];
