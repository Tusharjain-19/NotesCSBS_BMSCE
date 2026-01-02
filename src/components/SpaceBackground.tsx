import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  element: HTMLDivElement;
}

export function SpaceBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const createParticle = useCallback((container: HTMLDivElement): Particle => {
    const element = document.createElement("div");
    const size = Math.random() * 4 + 2;
    const x = Math.random() * container.offsetWidth;
    const y = Math.random() * container.offsetHeight;
    
    element.className = "particle";
    element.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%);
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    container.appendChild(element);
    
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size,
      opacity: Math.random() * 0.5 + 0.3,
      element,
    };
  }, []);

  const animate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    particlesRef.current.forEach((particle) => {
      // Calculate distance from mouse
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 200;

      if (distance < maxDistance) {
        // Repel from cursor
        const force = (maxDistance - distance) / maxDistance;
        const angle = Math.atan2(dy, dx);
        particle.vx -= Math.cos(angle) * force * 0.5;
        particle.vy -= Math.sin(angle) * force * 0.5;
        particle.opacity = Math.min(1, particle.opacity + 0.1);
      } else {
        particle.opacity = Math.max(0.3, particle.opacity - 0.02);
      }

      // Apply velocity with damping
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      // Add slight random movement
      particle.vx += (Math.random() - 0.5) * 0.1;
      particle.vy += (Math.random() - 0.5) * 0.1;

      // Wrap around edges
      if (particle.x < 0) particle.x = container.offsetWidth;
      if (particle.x > container.offsetWidth) particle.x = 0;
      if (particle.y < 0) particle.y = container.offsetHeight;
      if (particle.y > container.offsetHeight) particle.y = 0;

      // Update element position
      particle.element.style.left = `${particle.x}px`;
      particle.element.style.top = `${particle.y}px`;
      particle.element.style.opacity = `${particle.opacity}`;
      
      // Scale based on proximity to cursor
      const scale = distance < maxDistance ? 1 + (maxDistance - distance) / maxDistance : 1;
      particle.element.style.transform = `scale(${scale})`;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create static stars
    const starCount = 80;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.cssText = `
        position: absolute;
        width: ${Math.random() * 2 + 1}px;
        height: ${Math.random() * 2 + 1}px;
        background: hsl(var(--primary) / ${Math.random() * 0.4 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
      `;
      container.appendChild(star);
    }

    // Create interactive particles
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(container));
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top + window.scrollY,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      const stars = container.querySelectorAll(".star, .particle");
      stars.forEach((el) => el.remove());
      particlesRef.current = [];
    };
  }, [createParticle, animate]);

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