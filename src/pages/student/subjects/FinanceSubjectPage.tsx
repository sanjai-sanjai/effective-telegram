import { AppLayout } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { GameBadge } from "@/components/ui/game-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  Play, 
  Star, 
  Trophy,
  Zap,
  ChevronRight,
  Target,
  BookOpen,
  Gamepad2
} from "lucide-react";
import { useState } from "react";

interface GameCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  xp: number;
  coins: number;
  difficulty: "easy" | "medium" | "hard";
  status: "available" | "locked";
  route: string;
}

const financeGames: GameCard[] = [
  {
    id: "pocket-money",
    name: "Pocket Money Manager",
    description: "Learn budgeting and expense control",
    icon: Wallet,
    xp: 150,
    coins: 50,
    difficulty: "easy",
    status: "available",
    route: "/student/finance/game/pocket-money"
  },
  {
    id: "smart-shopper",
    name: "Smart Shopper Challenge",
    description: "Discover needs vs wants",
    icon: Target,
    xp: 150,
    coins: 50,
    difficulty: "easy",
    status: "available",
    route: "/student/finance/game/smart-shopper"
  },
  {
    id: "savings-grower",
    name: "Savings Grower",
    description: "Build consistent saving habits",
    icon: Zap,
    xp: 150,
    coins: 50,
    difficulty: "medium",
    status: "available",
    route: "/student/finance/game/savings-grower"
  },
  {
    id: "banking-basics",
    name: "Banking Basics Simulator",
    description: "Explore how banks grow money",
    icon: Wallet,
    xp: 200,
    coins: 60,
    difficulty: "medium",
    status: "available",
    route: "/student/finance/game/banking-basics"
  },
  {
    id: "price-compare",
    name: "Price Compare Master",
    description: "Find the best value, not just lowest price",
    icon: Target,
    xp: 150,
    coins: 50,
    difficulty: "medium",
    status: "available",
    route: "/student/finance/game/price-compare"
  },
  {
    id: "business-tycoon",
    name: "Mini Business Tycoon",
    description: "Learn profit and loss management",
    icon: Trophy,
    xp: 200,
    coins: 60,
    difficulty: "hard",
    status: "available",
    route: "/student/finance/game/business-tycoon"
  },
  {
    id: "digital-money",
    name: "Digital Money Explorer",
    description: "Compare cash vs digital payments",
    icon: Wallet,
    xp: 150,
    coins: 50,
    difficulty: "medium",
    status: "available",
    route: "/student/finance/game/digital-money"
  },
];

const activeLearningLevels = [
  {
    level: 1,
    name: "Earning & Spending",
    description: "Understand income and expenses",
    xp: 100,
    coins: 30
  },
  {
    level: 2,
    name: "Saving Strategies",
    description: "Learn effective saving methods",
    xp: 150,
    coins: 40
  },
  {
    level: 3,
    name: "Banking Essentials",
    description: "Explore how banks work",
    xp: 200,
    coins: 60
  }
];

interface GameCardProps {
  game: GameCard;
  onPlay: (game: GameCard) => void;
}

function GameCardComponent({ game, onPlay }: GameCardProps) {
  const Icon = game.icon;
  const difficultyColor = {
    easy: "bg-green-500/20 text-green-600",
    medium: "bg-yellow-500/20 text-yellow-600",
    hard: "bg-red-500/20 text-red-600"
  };

  return (
    <Card className="glass-card border border-accent/30 p-4 hover:scale-105 transition-transform">
      <div className="flex items-start justify-between mb-3">
        <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
          <Icon className="h-6 w-6 text-accent" />
        </div>
        <Badge className={`text-xs capitalize ${difficultyColor[game.difficulty]}`}>
          {game.difficulty}
        </Badge>
      </div>
      
      <h3 className="font-heading font-semibold text-foreground mb-1">{game.name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{game.description}</p>
      
      <div className="flex items-center gap-2 mb-4 text-xs">
        <span className="text-accent">+{game.coins} 🪙</span>
        <span className="text-primary">+{game.xp} XP</span>
      </div>
      
      <Button
        onClick={() => onPlay(game)}
        size="sm"
        className="w-full bg-accent hover:bg-accent/90"
      >
        <Play className="h-4 w-4 mr-1" />
        Play
      </Button>
    </Card>
  );
}

export default function FinanceSubjectPage() {
  const [selectedGame, setSelectedGame] = useState<GameCard | null>(null);
  const totalProgress = 65;

  const handlePlayGame = (game: GameCard) => {
    setSelectedGame(game);
    // Game will be launched from modal in next step
  };

  return (
    <AppLayout role="student" playCoins={1250} title="Finance">
      <div className="px-4 py-6 pb-24">
        {/* Subject Header */}
        <div className="mb-6 slide-up">
          <div className="glass-card rounded-2xl p-5 border border-border bg-gradient-to-br from-accent/20 to-accent/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-2xl bg-accent/30 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-accent" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-2xl font-bold text-foreground">Finance</h2>
                <p className="text-sm text-muted-foreground">Master your money skills</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-accent">{totalProgress}%</span>
              </div>
              <AnimatedProgress value={totalProgress} variant="default" />
            </div>
          </div>
        </div>

        {/* Learning Tabs */}
        <Tabs defaultValue="gamified" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Active</span>
            </TabsTrigger>
            <TabsTrigger value="passive" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Passive</span>
            </TabsTrigger>
            <TabsTrigger value="gamified" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">Gamified</span>
            </TabsTrigger>
          </TabsList>

          {/* Active Learning Tab */}
          <TabsContent value="active" className="space-y-4">
            <div className="mb-4">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Learning Levels
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Complete levels to build your skills</p>
            </div>

            <div className="space-y-3">
              {activeLearningLevels.map((level, index) => (
                <Card 
                  key={level.level}
                  className="glass-card border border-primary/30 p-4 slide-up"
                  style={{ animationDelay: `${100 + index * 75}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center shrink-0">
                      <span className="font-heading text-lg font-bold text-primary-foreground">{level.level}</span>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-foreground mb-1">
                        Level {level.level}: {level.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-accent">+{level.coins} 🪙</span>
                        <span className="text-xs text-primary">+{level.xp} XP</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                    >
                      Start
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Passive Learning Tab */}
          <TabsContent value="passive" className="space-y-4">
            <div className="mb-4">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                Read & Learn
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Explore concepts at your own pace</p>
            </div>

            <div className="space-y-3">
              {[
                { chapter: 1, title: "Introduction to Money", duration: "5 min" },
                { chapter: 2, title: "Understanding Savings", duration: "7 min" },
                { chapter: 3, title: "Banking Basics", duration: "6 min" }
              ].map((item, index) => (
                <Card 
                  key={item.chapter}
                  className="glass-card border border-secondary/30 p-4 slide-up cursor-pointer hover:border-secondary/60"
                  style={{ animationDelay: `${100 + index * 75}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <BookOpen className="h-6 w-6 text-secondary-foreground" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-foreground">
                        Chapter {item.chapter}: {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">📖 {item.duration} read</p>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gamified Learning Tab */}
          <TabsContent value="gamified" className="space-y-4">
            <div className="mb-4">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-accent" />
                Game Cards
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Learn through interactive games</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financeGames.map((game, index) => (
                <div
                  key={game.id}
                  className="slide-up"
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                >
                  <GameCardComponent game={game} onPlay={handlePlayGame} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
