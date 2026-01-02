import { useEffect, useRef, useState } from "react";

interface FloatingCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FloatingCard({ children, delay = 0, className = "" }: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Calculate parallax offset
  const parallaxOffset = isInView ? (scrollY * 0.05 * (1 + delay * 0.1)) : 0;
  
  // Floating animation with different phases based on delay
  const floatPhase = delay * 0.5;

  return (
    <div
      ref={cardRef}
      data-magnetic
      className={`floating-card ${className}`}
      style={{
        transform: `translateY(${-parallaxOffset}px)`,
        animation: `float-gentle 4s ease-in-out ${floatPhase}s infinite`,
      }}
    >
      {children}
      <style>{`
        @keyframes float-gentle {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-8px) rotate(0.5deg); 
          }
          50% { 
            transform: translateY(-12px) rotate(0deg); 
          }
          75% { 
            transform: translateY(-6px) rotate(-0.5deg); 
          }
        }
        
        .floating-card {
          transition: box-shadow 0.3s ease, filter 0.3s ease;
        }
        
        .floating-card:hover {
          animation-play-state: paused !important;
          filter: brightness(1.05);
        }
      `}</style>
    </div>
  );
}
