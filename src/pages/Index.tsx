import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { SemesterCard } from "@/components/SemesterCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SpaceBackground } from "@/components/SpaceBackground";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
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
  const semestersAnimation = useScrollAnimation();
  const footerAnimation = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Full Page Hero + Semesters Section */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <SpaceBackground />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10 flex flex-col min-h-[calc(100vh-4rem)]">
          {/* Hero Content */}
          <div 
            ref={heroAnimation.ref}
            className={`flex flex-col items-center text-center mb-12 transition-all duration-700 ${
              heroAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="mb-6 animate-[float_3s_ease-in-out_infinite]">
              <img 
                src={notesCsbsLogo} 
                alt="notes.csbs Logo" 
                className="h-40 w-auto md:h-52 lg:h-64 object-contain drop-shadow-lg"
              />
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-1">
              All CSBS academic resources in one place
            </p>
            <p className="text-xs text-muted-foreground">
              B.M.S. College of Engineering, Bangalore
            </p>
          </div>

          {/* Semesters Section */}
          <div 
            ref={semestersAnimation.ref}
            className={`flex-1 transition-all duration-700 delay-100 ${
              semestersAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-center">
              Select Your Semester
            </h2>
            <p className="text-muted-foreground text-center mb-8 text-sm">
              Choose a semester to view subjects and resources
            </p>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                {semesters?.map((semester, index) => (
                  <div
                    key={semester.id}
                    className={`transition-all duration-500 ${
                      semestersAnimation.isVisible 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${index * 75}ms` }}
                  >
                    <SemesterCard
                      id={semester.id}
                      name={semester.name}
                      order={semester.order}
                      index={index}
                    />
                  </div>
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

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Index;
