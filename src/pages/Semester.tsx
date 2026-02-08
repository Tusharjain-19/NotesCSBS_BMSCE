import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SubjectCard } from "@/components/SubjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/Footer";
import { BookMarked, FlaskConical } from "lucide-react";

const Semester = () => {
  const { id } = useParams<{ id: string }>();
  const semesterId = parseInt(id || "0");

  const { data: semester, isLoading: semesterLoading } = useQuery({
    queryKey: ["semester", semesterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("semesters")
        .select("*")
        .eq("id", semesterId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects", semesterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("semester_id", semesterId)
        .order("is_lab")
        .order("code");
      if (error) throw error;
      return data;
    },
  });

  const isLoading = semesterLoading || subjectsLoading;

  const theorySubjects = subjects?.filter(s => !s.is_lab) || [];
  const labSubjects = subjects?.filter(s => s.is_lab) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/20 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 max-w-5xl pb-24">
        <Breadcrumb 
          items={[
            { label: "Home", href: "/" },
            { label: semester?.name || "Loading..." }
          ]} 
        />

        {/* Semester Header with Gradient */}
        <div className="mb-8 mt-6 p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/20 dark:border-indigo-800/20">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {semester?.name || "Loading..."}
          </h1>
          <p className="text-sm text-muted-foreground">
            Select a subject to view available resources
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : subjects && subjects.length > 0 ? (
          <div className="space-y-8">
            {/* Theory Subjects */}
            {theorySubjects.length > 0 && (
              <section className="p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-200/20 dark:border-blue-800/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <BookMarked className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Theory Subjects</h2>
                </div>
                <div className="space-y-2">
                  {theorySubjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      id={subject.id}
                      name={subject.name}
                      code={subject.code}
                      isLab={subject.is_lab}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Lab Subjects */}
            {labSubjects.length > 0 && (
              <section className="p-6 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-200/20 dark:border-purple-800/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <FlaskConical className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Lab Subjects</h2>
                </div>
                <div className="space-y-2">
                  {labSubjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      id={subject.id}
                      name={subject.name}
                      code={subject.code}
                      isLab={subject.is_lab}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <p className="text-sm text-muted-foreground">
              No subjects available for this semester
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Semester;
