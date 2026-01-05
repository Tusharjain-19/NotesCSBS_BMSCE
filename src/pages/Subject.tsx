import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ResourceCard } from "@/components/ResourceCard";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  BookOpen, 
  FileCheck, 
  GraduationCap, 
  ChevronDown,
  Library
} from "lucide-react";
import { useState } from "react";

type ResourceType = "notes" | "cie1" | "cie2" | "cie3" | "see" | "book";

interface Resource {
  id: number;
  title: string;
  file_url: string;
  type: ResourceType;
  unit: string | null;
  year: number | null;
}

interface Unit {
  id: number;
  unit_number: number;
  unit_name: string;
}

const Subject = () => {
  const { id } = useParams<{ id: string }>();
  const subjectId = parseInt(id || "0");
  const [openUnits, setOpenUnits] = useState<Record<number, boolean>>({
    1: false, 2: false, 3: false, 4: false, 5: false
  });

  const { data: subject, isLoading: subjectLoading } = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*, semesters(*)")
        .eq("id", subjectId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ["resources", subjectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("subject_id", subjectId)
        .order("unit")
        .order("year", { ascending: false });
      if (error) throw error;
      return data as Resource[];
    },
  });

  const { data: units } = useQuery({
    queryKey: ["units", subjectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("subject_id", subjectId)
        .order("unit_number");
      if (error) throw error;
      return data as Unit[];
    },
  });

  const isLoading = subjectLoading || resourcesLoading;

  // Get unit name from units table
  const getUnitName = (unitNumber: number) => {
    const unit = units?.find(u => u.unit_number === unitNumber);
    return unit?.unit_name || `Unit ${unitNumber}`;
  };

  // Get notes grouped by unit
  const getNotesByUnit = (unitNumber: number) => {
    return resources?.filter(r => r.type === "notes" && r.unit === `Unit ${unitNumber}`) || [];
  };

  // Get CIE papers by type
  const getCIEPapers = (type: "cie1" | "cie2" | "cie3") => {
    return resources?.filter(r => r.type === type) || [];
  };

  // Get SEE papers
  const getSEEPapers = () => {
    return resources?.filter(r => r.type === "see") || [];
  };

  // Get Book resources
  const getBooks = () => {
    return resources?.filter(r => r.type === "book") || [];
  };

  // Check if subject is mathematics-related
  const isMathematicsSubject = () => {
    const name = subject?.name?.toLowerCase() || "";
    return name.includes("math") || name.includes("maths") || name.includes("mathematics");
  };

  const toggleUnit = (unit: number) => {
    setOpenUnits(prev => ({ ...prev, [unit]: !prev[unit] }));
  };

  const cieConfig = [
    { type: "cie1" as const, label: "CIE-1 Question Papers" },
    { type: "cie2" as const, label: "CIE-2 Question Papers" },
    { type: "cie3" as const, label: "CIE-3 Question Papers" },
  ];

  // Check if subject has units (Sem 7 & 8 subjects don't have units)
  const hasUnits = units && units.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <Breadcrumb 
          items={[
            { 
              label: subject?.semesters?.name || "Semester", 
              href: `/semester/${subject?.semester_id}` 
            },
            { label: subject?.name || "Loading..." }
          ]} 
        />

        {/* Subject Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {subject?.name || "Loading..."}
            </h1>
            {subject?.is_lab && (
              <Badge variant="default" className="bg-primary/20 text-primary border-0">
                Lab
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <Badge variant="outline">{subject?.code}</Badge>
            <span>•</span>
            <span>{subject?.semesters?.name}</span>
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* SECTION 1: NOTES (Unit-wise) - Only show for subjects with units */}
            {hasUnits && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Notes</h2>
                    <p className="text-sm text-muted-foreground">Study materials organized by unit</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((unitNum) => {
                    const unitNotes = getNotesByUnit(unitNum);
                    const unitName = getUnitName(unitNum);
                    return (
                      <Collapsible
                        key={unitNum}
                        open={openUnits[unitNum]}
                        onOpenChange={() => toggleUnit(unitNum)}
                      >
                        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/50 bg-card p-4 text-left transition-all hover:border-primary/30 hover:bg-accent/50">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="font-semibold shrink-0">
                              Unit {unitNum}
                            </Badge>
                            <span className="text-sm text-foreground font-medium">
                              {unitName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({unitNotes.length} {unitNotes.length === 1 ? "file" : "files"})
                            </span>
                          </div>
                          <ChevronDown 
                            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                              openUnits[unitNum] ? "rotate-180" : ""
                            }`} 
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-3">
                          {unitNotes.length > 0 ? (
                            <div className="grid gap-3 pl-4 border-l-2 border-primary/20 ml-4">
                              {unitNotes.map((resource, index) => (
                                <ResourceCard
                                  key={resource.id}
                                  id={resource.id}
                                  title={resource.title}
                                  fileUrl={resource.file_url}
                                  year={resource.year}
                                  index={index}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="pl-4 border-l-2 border-primary/20 ml-4 py-4">
                              <p className="text-sm text-muted-foreground">No notes available yet</p>
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </section>
            )}

            {/* For Sem 7 & 8 subjects without units - show simple notes section */}
            {!hasUnits && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Resources</h2>
                    <p className="text-sm text-muted-foreground">Study materials and documents</p>
                  </div>
                </div>

                {resources && resources.filter(r => r.type === "notes").length > 0 ? (
                  <div className="grid gap-3">
                    {resources.filter(r => r.type === "notes").map((resource, index) => (
                      <ResourceCard
                        key={resource.id}
                        id={resource.id}
                        title={resource.title}
                        fileUrl={resource.file_url}
                        year={resource.year}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title="No resources available"
                    description="Resources will be added soon. Check back later!"
                  />
                )}
              </section>
            )}

            {/* SECTION 2: CIE Papers (Exam-wise) - Only show for subjects with units */}
            {hasUnits && (
              <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">CIE Papers</h2>
                    <p className="text-sm text-muted-foreground">Continuous Internal Evaluation question papers</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {cieConfig.map(({ type, label }) => {
                    const papers = getCIEPapers(type);
                    return (
                      <div key={type} className="rounded-lg border border-border/50 bg-card p-4">
                        <h3 className="font-semibold text-foreground mb-3">{label}</h3>
                        {papers.length > 0 ? (
                          <div className="space-y-3">
                            {papers.map((resource, index) => (
                              <ResourceCard
                                key={resource.id}
                                id={resource.id}
                                title={resource.title}
                                fileUrl={resource.file_url}
                                year={resource.year}
                                index={index}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground py-4">No papers available</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SECTION 3: SEE Papers - Only show for subjects with units */}
            {hasUnits && (
              <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">SEE Papers</h2>
                    <p className="text-sm text-muted-foreground">Semester End Examination previous year papers</p>
                  </div>
                </div>

                {getSEEPapers().length > 0 ? (
                  <div className="grid gap-3">
                    {getSEEPapers().map((resource, index) => (
                      <ResourceCard
                        key={resource.id}
                        id={resource.id}
                        title={resource.title}
                        fileUrl={resource.file_url}
                        year={resource.year}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title="No SEE papers available"
                    description="Previous year SEE papers will be added soon. Check back later!"
                  />
                )}
              </section>
            )}

            {/* SECTION 4: Books / Question Bank */}
            <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <Library className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {isMathematicsSubject() ? "Question Bank" : "Books"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isMathematicsSubject() 
                      ? "Practice questions and problem sets" 
                      : "Reference books and textbooks"}
                  </p>
                </div>
              </div>

              {getBooks().length > 0 ? (
                <div className="grid gap-3">
                  {getBooks().map((resource, index) => (
                    <ResourceCard
                      key={resource.id}
                      id={resource.id}
                      title={resource.title}
                      fileUrl={resource.file_url}
                      year={resource.year}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title={isMathematicsSubject() ? "No question bank available" : "No books available"}
                  description={isMathematicsSubject() 
                    ? "Practice questions will be added soon. Check back later!"
                    : "Reference books will be added soon. Check back later!"}
                />
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Subject;
