import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { SemesterCard } from "@/components/SemesterCard";
import { Skeleton } from "@/components/ui/skeleton";
import bmsceLogo from "@/assets/bmsce-logo.png";

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="relative flex flex-col items-center text-center animate-fade-in-up">
            <div className="mb-6 animate-float">
              <img 
                src={bmsceLogo} 
                alt="BMSCE Logo" 
                className="h-24 w-24 md:h-32 md:w-32 object-contain drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              notes<span className="text-primary">.csbs</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-2">
              All CSBS academic resources in one place
            </p>
            <p className="text-sm text-muted-foreground">
              B.M.S. College of Engineering, Bangalore
            </p>
          </div>
        </div>
      </section>

      {/* Semesters Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Select Your Semester
          </h2>
          <p className="text-muted-foreground">
            Choose a semester to view subjects and resources
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {semesters?.map((semester, index) => (
              <SemesterCard
                key={semester.id}
                id={semester.id}
                name={semester.name}
                order={semester.order}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for CSBS students at BMSCE
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Not affiliated with BMS College of Engineering officially
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
