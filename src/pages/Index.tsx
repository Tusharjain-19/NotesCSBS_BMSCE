import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedHeader } from "@/components/AnimatedMenu";
import { FloatingCard } from "@/components/FloatingCard";
import { InfiniteCarousel } from "@/components/InfiniteCarousel";
import { SemesterCard } from "@/components/SemesterCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SpaceBackground } from "@/components/SpaceBackground";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Footer } from "@/components/Footer";
import notesCsbsLogo from "@/assets/notes-csbs-logo.png";

const Index = () => {
  const { data: semesters, isLoading } = useQuery({
    queryKey: ["semesters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("semesters")
        .select("*")
        .order("order");
      if (error) throw error;
      return data;
    },
  });

  const heroAnimation = useScrollAnimation();
  const carouselAnimation = useScrollAnimation();
  const semestersAnimation = useScrollAnimation();
  const footerAnimation = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnimatedHeader />
      
      {/* Full Page Hero + Semesters Section */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <SpaceBackground />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16 relative z-10 flex flex-col min-h-[calc(100vh-4rem)]">
          {/* Hero Content */}
          <div 
            ref={heroAnimation.ref}
            className={`flex flex-col items-center text-center mb-6 sm:mb-8 transition-all duration-700 ${
              heroAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            <FloatingCard delay={0} className="mb-4 sm:mb-6">
              <img 
                src={notesCsbsLogo} 
                alt="Notes CSBS Logo" 
                className="h-28 w-auto sm:h-40 md:h-52 lg:h-64 object-contain drop-shadow-lg"
                data-magnetic
              />
            </FloatingCard>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mb-1 px-4">
              All CSBS academic resources in one place
            </p>
            <p className="text-xs text-muted-foreground">
              B.M.S. College of Engineering, Bangalore
            </p>
          </div>

          {/* Infinite Carousel Section */}
          <div 
            ref={carouselAnimation.ref}
            className={`mb-12 transition-all duration-700 delay-75 ${
              carouselAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            {!isLoading && semesters && semesters.length > 0 && (
              <InfiniteCarousel items={semesters} speed={40} pauseOnHover />
            )}
          </div>

          {/* Semesters Grid Section */}
          <div 
            ref={semestersAnimation.ref}
            className={`flex-1 transition-all duration-700 delay-150 ${
              semestersAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-1.5 sm:mb-2 text-center">
              Select Your Semester
            </h2>
            <p className="text-muted-foreground text-center mb-4 sm:mb-8 text-xs sm:text-sm px-4">
              Choose a semester to view subjects and resources
            </p>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto w-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 sm:h-32 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto w-full">
                {semesters?.map((semester, index) => (
                  <FloatingCard
                    key={semester.id}
                    delay={index}
                    className={`transition-all duration-500 ${
                      semestersAnimation.isVisible 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    <SemesterCard
                      id={semester.id}
                      name={semester.name}
                      order={semester.order}
                      index={index}
                    />
                  </FloatingCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        ref={footerAnimation.ref}
        className={`border-t border-border bg-card/50 py-8 mt-12 transition-all duration-700 ${
          footerAnimation.isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-4"
        }`}
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for CSBS students at BMSCE
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Not affiliated with BMS College of Engineering officially
          </p>
        </div>
      </footer>
      <Footer />
    </div>
  );
};

export default Index;
