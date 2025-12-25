import { useEffect, useRef } from "react";

export function SpaceBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create stars
    const createStars = () => {
      const starCount = 100;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.cssText = `
          position: absolute;
          width: ${Math.random() * 2 + 1}px;
          height: ${Math.random() * 2 + 1}px;
          background: hsl(var(--primary) / ${Math.random() * 0.5 + 0.3});
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
          animation-delay: ${Math.random() * 2}s;
        `;
        container.appendChild(star);
      }
    };

    createStars();

    return () => {
      const stars = container.querySelectorAll(".star");
      stars.forEach((star) => star.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
