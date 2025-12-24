import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SubjectCard } from "@/components/SubjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: semester?.name || "Loading..." }
          ]} 
        />

        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {semester?.name || "Loading..."}
          </h1>
          <p className="text-muted-foreground">
            Select a subject to view notes, question banks, and more
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
        ) : subjects && subjects.length > 0 ? (
          <>
            {/* Theory Subjects */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Theory Subjects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects
                  .filter((s) => !s.is_lab)
                  .map((subject, index) => (
                    <SubjectCard
                      key={subject.id}
                      id={subject.id}
                      name={subject.name}
                      code={subject.code}
                      isLab={subject.is_lab}
                      index={index}
                    />
                  ))}
              </div>
            </div>

            {/* Lab Subjects */}
            {subjects.some((s) => s.is_lab) && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Lab Subjects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects
                    .filter((s) => s.is_lab)
                    .map((subject, index) => (
                      <SubjectCard
                        key={subject.id}
                        id={subject.id}
                        name={subject.name}
                        code={subject.code}
                        isLab={subject.is_lab}
                        index={index}
                      />
                    ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState 
            title="No subjects available"
            description="Subjects for this semester will be added soon. Check back later!"
          />
        )}
      </main>
    </div>
  );
};

export default Semester;
