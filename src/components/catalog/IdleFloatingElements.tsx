import { useState, useEffect } from "react";
import { getCategoryConfig } from "./CategoryColors";

interface FloatingElement {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface IdleFloatingElementsProps {
  isActive: boolean;
  category: string;
}

export const IdleFloatingElements = ({ isActive, category }: IdleFloatingElementsProps) => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    if (!isActive) {
      setElements([]);
      return;
    }

    const config = getCategoryConfig(category);
    const emojis = config.floatingEmojis;

    // Generate random floating elements
    const newElements: FloatingElement[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 80 + 10, // 10-90% of width
      y: Math.random() * 60 + 20, // 20-80% of height
      size: Math.random() * 20 + 16, // 16-36px
      delay: Math.random() * 2, // 0-2s delay
      duration: Math.random() * 4 + 4, // 4-8s duration
    }));

    setElements(newElements);

    // Regenerate elements periodically
    const interval = setInterval(() => {
      setElements(prev => prev.map(el => ({
        ...el,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
      })));
    }, 8000);

    return () => clearInterval(interval);
  }, [isActive, category]);

  if (!isActive || elements.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute animate-float opacity-40 hover:opacity-70 transition-opacity"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: `${element.size}px`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${element.duration}s`,
          }}
        >
          {element.emoji}
        </div>
      ))}
    </div>
  );
};

export default IdleFloatingElements;
