import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, FileText, Beaker, Code, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Semester {
  id: number;
  name: string;
  order: number;
}

interface InfiniteCarouselProps {
  items: Semester[];
  speed?: number;
  pauseOnHover?: boolean;
}

const semesterIcons = [BookOpen, GraduationCap, FileText, Beaker, Code, Database];

export function InfiniteCarousel({ items, speed = 30, pauseOnHover = true }: InfiniteCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!scrollerRef.current) return;
    
    const scroller = scrollerRef.current;
    const scrollContent = scroller.querySelector('.scroll-content') as HTMLElement;
    
    if (!scrollContent) return;

    // Clone items for infinite effect
    const clone = scrollContent.cloneNode(true) as HTMLElement;
    scroller.appendChild(clone);

    // Calculate animation duration based on content width
    const contentWidth = scrollContent.offsetWidth;
    const duration = contentWidth / speed;

    scroller.style.setProperty('--scroll-duration', `${duration}s`);
  }, [items, speed]);

  return (
    <div 
      className="relative overflow-hidden py-4"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div 
        ref={scrollerRef}
        className={`flex gap-6 carousel-scroller ${isPaused ? 'paused' : ''}`}
      >
        <div className="scroll-content flex gap-6 shrink-0">
          {items.map((semester, index) => {
            const Icon = semesterIcons[index % semesterIcons.length];
            return (
              <Link 
                key={semester.id} 
                to={`/semester/${semester.id}`}
                data-magnetic
                className="shrink-0"
              >
                <Card className="group w-40 sm:w-52 border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5">
                    <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                      <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-xs sm:text-sm">{semester.name}</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">View subjects</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .carousel-scroller {
          animation: scroll var(--scroll-duration, 20s) linear infinite;
        }
        
        .carousel-scroller.paused {
          animation-play-state: paused;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
