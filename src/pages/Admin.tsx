import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, LogOut, BookOpen, FileText, GraduationCap } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";

type ResourceType = "notes" | "cie1" | "cie2" | "cie3" | "see";

interface Subject {
  id: number;
  name: string;
  code: string;
  semester_id: number;
  is_lab: boolean;
}

interface Unit {
  id: number;
  unit_number: number;
  unit_name: string;
  subject_id: number;
}

interface Resource {
  id: number;
  title: string;
  file_url: string;
  type: ResourceType;
  unit: string | null;
  year: number | null;
  subject_id: number;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  // Form states
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [resourceType, setResourceType] = useState<ResourceType>("notes");
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [year, setYear] = useState<string>("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auth check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate("/auth");
        } else {
          // Check admin role
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin'
    });
    
    setIsAdmin(data === true);
  };

  // Fetch semesters
  const { data: semesters } = useQuery({
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

  // Fetch subjects for selected semester
  const { data: subjects } = useQuery({
    queryKey: ["subjects", selectedSemester],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("semester_id", parseInt(selectedSemester))
        .order("code");
      if (error) throw error;
      return data as Subject[];
    },
    enabled: !!selectedSemester,
  });

  // Fetch units for selected subject
  const { data: units } = useQuery({
    queryKey: ["units", selectedSubject],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("subject_id", parseInt(selectedSubject))
        .order("unit_number");
      if (error) throw error;
      return data as Unit[];
    },
    enabled: !!selectedSubject,
  });

  // Fetch existing resources for selected subject
  const { data: resources } = useQuery({
    queryKey: ["resources", selectedSubject],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("subject_id", parseInt(selectedSubject))
        .order("unit")
        .order("type");
      if (error) throw error;
      return data as Resource[];
    },
    enabled: !!selectedSubject,
  });

  // Add resource mutation
  const addResourceMutation = useMutation({
    mutationFn: async () => {
      const resourceData = {
        subject_id: parseInt(selectedSubject),
        title: title.trim(),
        file_url: fileUrl.trim(),
        type: resourceType,
        unit: resourceType === "notes" && selectedUnit ? `Unit ${selectedUnit}` : null,
        year: year ? parseInt(year) : null,
      };

      const { error } = await supabase.from("resources").insert(resourceData);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Resource added successfully!" });
      setTitle("");
      setFileUrl("");
      setYear("");
      queryClient.invalidateQueries({ queryKey: ["resources", selectedSubject] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add resource",
        variant: "destructive",
      });
    },
  });

  // Delete resource mutation
  const deleteResourceMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", resourceId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Deleted", description: "Resource removed" });
      queryClient.invalidateQueries({ queryKey: ["resources", selectedSubject] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete",
        variant: "destructive",
      });
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject || !title.trim() || !fileUrl.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addResourceMutation.mutate();
  };

  // Loading state
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not admin
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges. Contact the administrator to get access.
          </p>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </main>
      </div>
    );
  }

  const getTypeLabel = (type: ResourceType) => {
    const labels: Record<ResourceType, string> = {
      notes: "Notes",
      cie1: "CIE-1",
      cie2: "CIE-2",
      cie3: "CIE-3",
      see: "SEE",
    };
    return labels[type];
  };

  const getTypeIcon = (type: ResourceType) => {
    if (type === "notes") return <BookOpen className="h-4 w-4" />;
    if (type === "see") return <GraduationCap className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage resources and study materials</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Add Resource Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Resource
              </CardTitle>
              <CardDescription>
                Add a new study material with Google Drive link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddResource} className="space-y-4">
                {/* Semester Selection */}
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={selectedSemester} onValueChange={(v) => {
                    setSelectedSemester(v);
                    setSelectedSubject("");
                    setSelectedUnit("");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters?.map((sem) => (
                        <SelectItem key={sem.id} value={sem.id.toString()}>
                          {sem.name}
                        </SelectItem>
                      ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject Selection */}
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select 
                    value={selectedSubject} 
                    onValueChange={(v) => {
                      setSelectedSubject(v);
                      setSelectedUnit("");
                    }}
                    disabled={!selectedSemester}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id.toString()}>
                          {sub.code} - {sub.name}
                        </SelectItem>
                      ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* Resource Type */}
                <div className="space-y-2">
                  <Label>Resource Type</Label>
                  <Tabs value={resourceType} onValueChange={(v) => setResourceType(v as ResourceType)}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="cie1">CIE-1</TabsTrigger>
                      <TabsTrigger value="cie2">CIE-2</TabsTrigger>
                      <TabsTrigger value="cie3">CIE-3</TabsTrigger>
                      <TabsTrigger value="see">SEE</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Unit Selection (only for notes) */}
                {resourceType === "notes" && units && units.length > 0 && (
                  <div className="space-y-2">
                    <Label>Unit (Optional for books/question banks)</Label>
                    <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit (or leave empty for books)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Unit (Books/QB)</SelectItem>
                        {units?.map((unit) => (
                          <SelectItem key={unit.id} value={unit.unit_number.toString()}>
                            Unit {unit.unit_number}: {unit.unit_name}
                          </SelectItem>
                        ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    placeholder="e.g., Unit 1 Notes - Introduction"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Google Drive URL */}
                <div className="space-y-2">
                  <Label>Google Drive Link *</Label>
                  <Input
                    placeholder="https://drive.google.com/file/d/..."
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Make sure the file has "Anyone with the link can view" access
                  </p>
                </div>

                {/* Year (optional) */}
                <div className="space-y-2">
                  <Label>Year (Optional)</Label>
                  <Input
                    type="number"
                    placeholder="2024"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min="2020"
                    max="2030"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={addResourceMutation.isPending}
                >
                  {addResourceMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Resource
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Resources</CardTitle>
              <CardDescription>
                {selectedSubject 
                  ? `${resources?.length || 0} resources for selected subject`
                  : "Select a subject to view resources"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedSubject ? (
                <p className="text-muted-foreground text-center py-8">
                  Select a semester and subject to view resources
                </p>
              ) : resources?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No resources yet. Add your first one!
                </p>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {resources?.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {getTypeIcon(resource.type)}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {resource.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {getTypeLabel(resource.type)}
                            </Badge>
                            {resource.unit && (
                              <Badge variant="outline" className="text-xs">
                                {resource.unit}
                              </Badge>
                            )}
                            {resource.year && (
                              <span className="text-xs text-muted-foreground">
                                {resource.year}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteResourceMutation.mutate(resource.id)}
                        disabled={deleteResourceMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
