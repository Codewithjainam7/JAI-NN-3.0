import React, { useEffect, useRef, useState } from 'react';

export const MouseTracker: React.FC = () => {
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [targetPosition, setTargetPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setTargetPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, input, textarea, .tilt-card');
      setIsHovering(!!clickable);
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // LERP Animation Loop
  useEffect(() => {
    let animationFrame: number;
    
    const animate = () => {
      setPosition(prev => {
        const lerpFactor = 0.15;
        const nextX = prev.x + (targetPosition.x - prev.x) * lerpFactor;
        const nextY = prev.y + (targetPosition.y - prev.y) * lerpFactor;
        return { x: nextX, y: nextY };
      });
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [targetPosition]);

  return (
    <>
      <div 
        ref={cursorDotRef}
        className="custom-cursor-dot"
        style={{ left: targetPosition.x, top: targetPosition.y }}
      />
      <div 
        ref={cursorRingRef}
        className={`custom-cursor-ring ${isHovering ? 'bg-white/10 scale-150 border-transparent' : ''}`}
        style={{ left: position.x, top: position.y }}
      />
    </>
  );
};