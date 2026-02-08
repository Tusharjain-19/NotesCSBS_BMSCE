import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { SemesterCard } from "@/components/SemesterCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/Footer";
import { BookOpen, GraduationCap } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-pink-500/10 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl pb-24 md:pb-12">
        {/* Hero Section */}
        <div className="mb-12 text-center p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            <span className="text-foreground">Notes </span>
            <span className="text-sky-500">CSBS</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your one-stop platform for CSBS academic resources at BMSCE
          </p>
        </div>

        {/* Info Card */}
        <div className="mb-10 p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-200/20 dark:border-blue-800/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">What You'll Find Here</h3>
              <p className="text-sm text-muted-foreground">
                Study materials, exam papers (CIE & SEE), lab resources, and reference books – organized semester-wise for easy access.
              </p>
            </div>
          </div>
        </div>

        {/* Semesters Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Select Your Semester</h2>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : semesters && semesters.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {semesters.map((semester, index) => (
                <SemesterCard
                  key={semester.id}
                  id={semester.id}
                  name={semester.name}
                  order={semester.order}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <p className="text-sm text-muted-foreground">
                No semesters available. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 text-center">
          <p className="text-sm text-muted-foreground">
            💙 Built with love for BMSCE CSBS students
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
