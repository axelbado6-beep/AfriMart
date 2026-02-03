import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
  size: number;
  rotation: number;
  shape: "circle" | "square" | "triangle";
}

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
  colors?: string[];
  particleCount?: number;
  duration?: number;
  origin?: { x: number; y: number };
}

const defaultColors = [
  "hsl(24, 95%, 53%)",   // afrimart-orange
  "hsl(45, 100%, 51%)",  // afrimart-gold
  "hsl(160, 84%, 39%)",  // afrimart-green
  "hsl(217, 91%, 60%)",  // afrimart-blue
  "hsl(270, 70%, 55%)",  // afrimart-purple
  "hsl(16, 100%, 66%)",  // afrimart-coral
];

export function ConfettiEffect({
  trigger,
  onComplete,
  colors = defaultColors,
  particleCount = 50,
  duration = 3000,
  origin = { x: 50, y: 50 },
}: ConfettiEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      
      const newParticles: Particle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.random() * 360 * Math.PI) / 180;
        const velocity = 50 + Math.random() * 150;
        const shapes: Array<"circle" | "square" | "triangle"> = ["circle", "square", "triangle"];
        
        newParticles.push({
          id: i,
          x: origin.x,
          y: origin.y,
          tx: Math.cos(angle) * velocity,
          ty: Math.sin(angle) * velocity - 100, // Bias upward
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 6 + Math.random() * 8,
          rotation: Math.random() * 360,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }
      
      setParticles(newParticles);
      
      setTimeout(() => {
        setIsActive(false);
        setParticles([]);
        onComplete?.();
      }, duration);
    }
  }, [trigger, isActive, particleCount, colors, duration, origin, onComplete]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.shape !== "triangle" ? particle.color : "transparent",
            borderRadius: particle.shape === "circle" ? "50%" : "0",
            transform: `rotate(${particle.rotation}deg)`,
            borderLeft: particle.shape === "triangle" ? `${particle.size / 2}px solid transparent` : undefined,
            borderRight: particle.shape === "triangle" ? `${particle.size / 2}px solid transparent` : undefined,
            borderBottom: particle.shape === "triangle" ? `${particle.size}px solid ${particle.color}` : undefined,
            "--tx": `${particle.tx}px`,
            "--ty": `${particle.ty}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// Simplified mini confetti for inline use
export function MiniConfetti({
  trigger,
  className = "",
}: {
  trigger: boolean;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!show) return null;

  const emojis = ["🎉", "✨", "⭐", "🌟", "💫"];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {emojis.map((emoji, i) => (
        <span
          key={i}
          className="absolute animate-float-up text-lg"
          style={{
            left: `${20 + i * 15}%`,
            animationDelay: `${i * 0.1}s`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

export default ConfettiEffect;
