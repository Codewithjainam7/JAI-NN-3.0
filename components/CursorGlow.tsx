import React, { useEffect, useRef, useState } from 'react';

export const CursorGlow: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>();
  const targetRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable on desktop (devices with hover capability)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    
    if (!mediaQuery.matches) {
      return; // Don't show cursor glow on mobile
    }

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      setPosition(prev => {
        const dx = targetRef.current.x - prev.x;
        const dy = targetRef.current.y - prev.y;
        
        // Smooth follow with easing
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        };
      });
      
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="cursor-glow"
      style={{
        left: position.x - 30,
        top: position.y - 30,
      }}
    />
  );
};
