import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ResourceCard } from "@/components/ResourceCard";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  HelpCircle, 
  FileCheck, 
  GraduationCap, 
  FlaskConical 
} from "lucide-react";

type ResourceType = "notes" | "qb" | "cie1" | "cie2" | "cie3" | "see" | "lab";

const resourceTypeConfig: Record<ResourceType, { label: string; icon: typeof BookOpen; description: string }> = {
  notes: { label: "Notes", icon: BookOpen, description: "Study materials and notes" },
  qb: { label: "Question Bank", icon: HelpCircle, description: "Practice questions" },
  cie1: { label: "CIE-1", icon: FileCheck, description: "First internal exam" },
  cie2: { label: "CIE-2", icon: FileCheck, description: "Second internal exam" },
  cie3: { label: "CIE-3", icon: FileCheck, description: "Third internal exam" },
  see: { label: "SEE", icon: GraduationCap, description: "End semester papers" },
  lab: { label: "Lab", icon: FlaskConical, description: "Lab materials" },
};

const Subject = () => {
  const { id } = useParams<{ id: string }>();
  const subjectId = parseInt(id || "0");

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
        .order("year", { ascending: false })
        .order("unit");
      if (error) throw error;
      return data;
    },
  });

  const isLoading = subjectLoading || resourcesLoading;

  const getResourcesByType = (type: ResourceType) => {
    return resources?.filter((r) => r.type === type) || [];
  };

  const getResourceCount = (type: ResourceType) => {
    return getResourcesByType(type).length;
  };

  // Determine which tabs to show based on subject type
  const availableTabs: ResourceType[] = subject?.is_lab 
    ? ["lab", "notes"]
    : ["notes", "qb", "cie1", "cie2", "cie3", "see"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { 
              label: subject?.semesters?.name || "Semester", 
              href: `/semester/${subject?.semester_id}` 
            },
            { label: subject?.name || "Loading..." }
          ]} 
        />

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
          <div className="space-y-4">
            <Skeleton className="h-12 w-full max-w-2xl" />
            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <Tabs defaultValue={availableTabs[0]} className="animate-fade-in">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 mb-6">
              {availableTabs.map((type) => {
                const config = resourceTypeConfig[type];
                const count = getResourceCount(type);
                const Icon = config.icon;
                
                return (
                  <TabsTrigger 
                    key={type}
                    value={type}
                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{config.label}</span>
                    {count > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1.5 text-xs">
                        {count}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {availableTabs.map((type) => {
              const typeResources = getResourcesByType(type);
              const config = resourceTypeConfig[type];

              return (
                <TabsContent key={type} value={type} className="mt-0">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      {config.label}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {config.description}
                    </p>
                  </div>

                  {typeResources.length > 0 ? (
                    <div className="grid gap-3">
                      {typeResources.map((resource, index) => (
                        <ResourceCard
                          key={resource.id}
                          id={resource.id}
                          title={resource.title}
                          fileUrl={resource.file_url}
                          unit={resource.unit}
                          year={resource.year}
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      title={`No ${config.label.toLowerCase()} available`}
                      description={`${config.label} materials will be added soon. Check back later!`}
                    />
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Subject;
