import { useEffect, useState, useCallback } from "react";

interface MagneticElement {
  element: HTMLElement;
  rect: DOMRect;
}

export function MagneticCursor() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });

    // Find all magnetic elements
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach((el) => {
      const element = el as HTMLElement;
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      const magneticRadius = 150;
      const maxMovement = 15;
      
      if (distance < magneticRadius) {
        setIsHovering(true);
        const force = (magneticRadius - distance) / magneticRadius;
        const moveX = (deltaX / distance) * force * maxMovement;
        const moveY = (deltaY / distance) * force * maxMovement;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        element.style.transition = 'transform 0.2s ease-out';
      } else {
        element.style.transform = '';
        element.style.transition = 'transform 0.4s ease-out';
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    magneticElements.forEach((el) => {
      const element = el as HTMLElement;
      element.style.transform = '';
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <>
      {/* Cursor follower */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`rounded-full bg-primary transition-all duration-300 ${
            isHovering ? 'w-12 h-12 opacity-30' : 'w-4 h-4 opacity-50'
          }`}
        />
      </div>
      {/* Trailing dot */}
      <div
        className="fixed pointer-events-none z-[9998] hidden md:block"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.15s ease-out, top 0.15s ease-out',
        }}
      >
        <div className="w-2 h-2 rounded-full bg-primary/40" />
      </div>
    </>
  );
}
