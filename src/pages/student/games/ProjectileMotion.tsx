import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { GameBadge } from "@/components/ui/game-badge";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { ConceptIntroPopup } from "@/components/ui/concept-intro-popup";
import { GameCompletionPopup } from "@/components/ui/game-completion-popup";
import { ArrowLeft, Target, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  trail: Array<{ x: number; y: number }>;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const CANNON_X = 50;
const CANNON_Y = 320;
const TARGET_X = 650;
const TARGET_Y = 280;
const TARGET_WIDTH = 60;
const TARGET_HEIGHT = 50;
const GRAVITY = 0.5;
const MAX_HITS = 3;

export default function ProjectileMotion() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(15);
  const [projectile, setProjectile] = useState<Projectile>({
    x: CANNON_X,
    y: CANNON_Y,
    vx: 0,
    vy: 0,
    active: false,
    trail: [],
  });
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameStatus, setGameStatus] = useState<"ready" | "firing" | "result">("ready");
  const [lastResult, setLastResult] = useState<"hit" | "miss" | null>(null);
  const animationRef = useRef<number | null>(null);

  // Check hit after projectile stops
  useEffect(() => {
    if (!projectile.active && gameStatus === "firing") {
      const isHit =
        projectile.x > TARGET_X &&
        projectile.x < TARGET_X + TARGET_WIDTH &&
        projectile.y > TARGET_Y &&
        projectile.y < TARGET_Y + TARGET_HEIGHT;

      setLastResult(isHit ? "hit" : "miss");
      setGameStatus("result");
    }
  }, [projectile.active, gameStatus]);

  // Physics simulation
  useEffect(() => {
    if (!projectile.active || gameStatus !== "firing") return;

    const animate = () => {
      setProjectile((prev) => {
        let newProjectile = { ...prev };
        newProjectile.x += newProjectile.vx;
        newProjectile.y += newProjectile.vy;
        newProjectile.vy += GRAVITY;

        newProjectile.trail = [
          ...newProjectile.trail.slice(-30),
          { x: newProjectile.x, y: newProjectile.y },
        ];

        // Out of bounds
        if (newProjectile.x > GAME_WIDTH || newProjectile.y > GAME_HEIGHT) {
          newProjectile.active = false;
          return newProjectile;
        }

        return newProjectile;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [projectile.active, gameStatus]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Ground
    ctx.fillStyle = "#8B7355";
    ctx.fillRect(0, GAME_HEIGHT - 60, GAME_WIDTH, 60);

    // Grass
    ctx.strokeStyle = "#228B22";
    ctx.lineWidth = 2;
    for (let i = 0; i < GAME_WIDTH; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, GAME_HEIGHT - 60);
      ctx.lineTo(i + 20, GAME_HEIGHT - 50);
      ctx.stroke();
    }

    // Target
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(TARGET_X, TARGET_Y, TARGET_WIDTH, TARGET_HEIGHT);
    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.arc(TARGET_X + TARGET_WIDTH / 2, TARGET_Y + TARGET_HEIGHT / 2, 12, 0, Math.PI * 2);
    ctx.fill();

    // Cannon base
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(CANNON_X, CANNON_Y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Cannon barrel
    const angleRad = (angle * Math.PI) / 180;
    const barrelLength = 30;
    const barrelEndX = CANNON_X + Math.cos(angleRad) * barrelLength;
    const barrelEndY = CANNON_Y - Math.sin(angleRad) * barrelLength;
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(CANNON_X, CANNON_Y);
    ctx.lineTo(barrelEndX, barrelEndY);
    ctx.stroke();

    // Projectile trail
    if (projectile.trail.length > 1) {
      ctx.strokeStyle = "rgba(255, 165, 0, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(projectile.trail[0].x, projectile.trail[0].y);
      for (let i = 1; i < projectile.trail.length; i++) {
        ctx.lineTo(projectile.trail[i].x, projectile.trail[i].y);
      }
      ctx.stroke();
    }

    // Projectile
    if (projectile.active) {
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFA500";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Result feedback
    if (lastResult === "hit") {
      ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
      ctx.fillRect(TARGET_X - 20, TARGET_Y - 20, TARGET_WIDTH + 40, TARGET_HEIGHT + 40);
      ctx.fillStyle = "#00AA00";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("HIT!", TARGET_X + TARGET_WIDTH / 2, TARGET_Y - 30);
    } else if (lastResult === "miss") {
      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = "#AA0000";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("MISSED", GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }
  }, [projectile, angle, lastResult]);

  const handleFire = () => {
    if (gameStatus !== "ready") return;
    if (hits >= MAX_HITS) return;

    const angleRad = (angle * Math.PI) / 180;
    const speedMultiplier = speed / 20;

    setProjectile({
      x: CANNON_X,
      y: CANNON_Y,
      vx: Math.cos(angleRad) * speedMultiplier * 8,
      vy: -Math.sin(angleRad) * speedMultiplier * 8,
      active: true,
      trail: [{ x: CANNON_X, y: CANNON_Y }],
    });

    setAttempts((prev) => prev + 1);
    setLastResult(null);
    setGameStatus("firing");
  };

  const handleRetry = () => {
    setProjectile({
      x: CANNON_X,
      y: CANNON_Y,
      vx: 0,
      vy: 0,
      active: false,
      trail: [],
    });
    setLastResult(null);
    setGameStatus("ready");
  };

  const handleResultNext = () => {
    if (lastResult === "hit") {
      setHits((prev) => {
        const newHits = prev + 1;
        if (newHits >= MAX_HITS) {
          setShowCompletion(true);
        }
        return newHits;
      });
    }

    handleRetry();
  };

  const handleStart = () => {
    setShowTutorial(false);
  };

  const handleGoBack = () => {
    navigate("/student/physics");
  };

  const handleExitFullscreen = () => {
    setIsFullscreen(false);
  };

  const gameContainer = (
    <div
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50 bg-black p-0" : "w-full bg-gradient-to-br from-blue-50 to-cyan-50 p-4"
      )}
    >
      {/* Fullscreen button */}
      {!isFullscreen && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={() => setIsFullscreen(true)}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Full Screen
          </Button>
        </div>
      )}

      {isFullscreen && (
        <Button
          onClick={() => setIsFullscreen(false)}
          size="sm"
          variant="outline"
          className="absolute top-4 right-4 z-10 gap-2 bg-white"
        >
          <Minimize2 className="w-4 h-4" />
          Exit
        </Button>
      )}

      {/* Canvas */}
      <div className={cn(
        "rounded-lg border-2 border-gray-300 shadow-lg bg-white overflow-hidden",
        isFullscreen ? "w-screen h-screen" : "w-full max-w-4xl"
      )}>
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="w-full h-full"
        />
      </div>

      {/* Controls */}
      {!isFullscreen && (
        <div className="mt-6 w-full max-w-4xl bg-white p-6 rounded-lg border border-gray-200">
          <div className="space-y-6">
            {/* Angle Control */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Angle: {angle}°
              </label>
              <input
                type="range"
                min="10"
                max="85"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                disabled={gameStatus !== "ready"}
                className="w-full"
              />
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Speed: {speed}
              </label>
              <input
                type="range"
                min="5"
                max="25"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={gameStatus !== "ready"}
                className="w-full"
              />
            </div>

            {/* Fire Button */}
            <Button
              onClick={handleFire}
              disabled={gameStatus !== "ready" || hits >= MAX_HITS}
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
            >
              🔥 FIRE!
            </Button>

            {/* Result Display */}
            {lastResult && (
              <div className={cn(
                "p-4 rounded-lg text-center font-bold text-white",
                lastResult === "hit"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-red-500 to-pink-500"
              )}>
                <div className="text-2xl mb-2">
                  {lastResult === "hit" ? "🎯 HIT!" : "❌ MISSED"}
                </div>
                <div className="text-sm mb-4">
                  {lastResult === "hit"
                    ? "Perfect! You balanced angle and speed!"
                    : "Try adjusting angle or speed"}
                </div>
                <Button
                  onClick={handleResultNext}
                  variant="outline"
                  className="w-full"
                >
                  {lastResult === "hit" ? "Next Shot ▶" : "Try Again"}
                </Button>
              </div>
            )}

            {/* Progress */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hits: {hits} / {MAX_HITS}
              </div>
              <div className="text-sm text-gray-600">
                Attempts: {attempts}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${(hits / MAX_HITS) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Embedded Info */}
      {!isFullscreen && (
        <div className="mt-6 w-full max-w-4xl bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">📘 Concept</h3>
              <p className="text-sm text-gray-700">
                Angle controls how high the projectile goes, while speed controls how far it travels. Gravity always pulls it down.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">🕹 How to Play</h3>
              <p className="text-sm text-gray-700">
                Adjust the angle and speed sliders, then fire to launch the projectile. Try to hit the red target 3 times!
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">🧠 What You Learn</h3>
              <p className="text-sm text-gray-700">
                Low angles create flat arcs, high angles create tall arcs. More speed means farther distance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AppLayout>
      <ConceptIntroPopup
        isOpen={showTutorial}
        onStart={handleStart}
        onGoBack={handleGoBack}
        conceptName="Projectile Motion"
        whatYouWillUnderstand="Learn how angle and speed affect where a projectile lands. Gravity always pulls it down."
        gameSteps={[
          "Adjust the angle slider to control the launch angle",
          "Adjust the speed slider to control launch power",
          "Click FIRE! to launch the projectile",
          "Try to hit the red target 3 times",
        ]}
        successMeaning="When the projectile hits the target, you'll see a HIT message! You win when you get 3 hits."
        icon="🎯"
      />

      <GameCompletionPopup
        isOpen={showCompletion}
        onPlayAgain={() => {
          setHits(0);
          setAttempts(0);
          setShowCompletion(false);
          handleRetry();
        }}
        onExitFullscreen={handleExitFullscreen}
        onBackToGames={handleGoBack}
        learningOutcome="You mastered projectile motion! You understand how angle and speed work together to control where something lands."
        isFullscreen={isFullscreen}
      />

      <div className="py-6">
        <div className="mb-4 flex items-center gap-2">
          <Button
            onClick={handleGoBack}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Physics
          </Button>
        </div>

        {gameContainer}
      </div>
    </AppLayout>
  );
}
