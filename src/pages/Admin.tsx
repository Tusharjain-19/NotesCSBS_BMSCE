import { useState, useEffect, useRef } from "react";
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
import { Loader2, Plus, Trash2, LogOut, BookOpen, FileText, GraduationCap, Upload, Link, Library } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";

type ResourceType = "notes" | "cie1" | "cie2" | "cie3" | "see" | "book";

// File validation constants
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'mp4', 'c', 'cpp', 'py', 'java', 'js', 'ts', 'h'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'application/msword',
  'text/plain',
  'image/jpeg',
  'image/png',
  'video/mp4',
  'text/x-c',
  'text/x-c++src',
  'text/x-python',
  'text/x-java',
  'text/javascript',
  'application/typescript',
  'text/x-csrc',
  'text/x-c++',
];

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
  const [uploadMode, setUploadMode] = useState<"link" | "file">("link");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Validate file before upload
  const validateFile = (file: File): string | null => {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" exceeds 50MB limit`;
    }
    
    // Validate file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      return `File "${file.name}" has invalid extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
    }
    
    // Validate MIME type (relaxed check for code files)
    const isCodeFile = ['c', 'cpp', 'py', 'java', 'js', 'ts', 'h'].includes(fileExt);
    if (!isCodeFile && file.type && !ALLOWED_MIME_TYPES.some(type => file.type.startsWith(type.split('/')[0]))) {
      return `File "${file.name}" has invalid file type`;
    }
    
    return null;
  };

  // Upload file to storage with timeout
  const uploadFile = async (file: File): Promise<string> => {
    // Validate before upload
    const validationError = validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${selectedSubject}/${fileName}`;
    
    // Create a timeout promise (2 minutes for large files)
    const UPLOAD_TIMEOUT = 120000; // 2 minutes
    
    const uploadPromise = supabase.storage
      .from('resources')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Upload timed out after ${UPLOAD_TIMEOUT / 1000} seconds. Try a smaller file or check your internet connection.`));
      }, UPLOAD_TIMEOUT);
    });
    
    // Race between upload and timeout
    const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);
    
    if (error) {
      // Provide more helpful error messages
      if (error.message?.includes('duplicate')) {
        throw new Error('A file with this name already exists. Please rename the file.');
      }
      if (error.message?.includes('policy')) {
        throw new Error('Permission denied. Please ensure you are logged in as admin.');
      }
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    const { data: urlData } = supabase.storage
      .from('resources')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  };

  // Add resource mutation
  const addResourceMutation = useMutation({
    mutationFn: async (resources: { title: string; fileUrl: string }[]) => {
      for (const res of resources) {
        const resourceData = {
          subject_id: parseInt(selectedSubject),
          title: res.title.trim(),
          file_url: res.fileUrl,
          type: resourceType,
          unit: resourceType === "notes" && selectedUnit && selectedUnit !== "none" ? `Unit ${selectedUnit}` : null,
          year: year ? parseInt(year) : null,
        };

        const { error } = await supabase.from("resources").insert(resourceData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Resources added successfully!" });
      setTitle("");
      setFileUrl("");
      setYear("");
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["resources", selectedSubject] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add resources",
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

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a subject",
        variant: "destructive",
      });
      return;
    }

    if (uploadMode === "link") {
      if (!title.trim() || !fileUrl.trim()) {
        toast({
          title: "Error",
          description: "Please provide title and Google Drive link",
          variant: "destructive",
        });
        return;
      }
      addResourceMutation.mutate([{ title: title.trim(), fileUrl: fileUrl.trim() }]);
      return;
    }

    if (uploadMode === "file" && selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const uploadedResources: { title: string; fileUrl: string }[] = [];
      const totalFiles = selectedFiles.length;
      
      // Get file extension label for generic naming
      const getFileTypeLabel = (fileName: string): string => {
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        const extLabels: Record<string, string> = {
          'pdf': 'PDF',
          'doc': 'Document',
          'docx': 'Document',
          'ppt': 'Presentation',
          'pptx': 'Presentation',
          'txt': 'Text',
          'jpg': 'Image',
          'jpeg': 'Image',
          'png': 'Image',
          'mp4': 'Video',
          'c': 'Code',
          'cpp': 'Code',
          'py': 'Code',
          'java': 'Code',
          'js': 'Code',
          'ts': 'Code',
          'h': 'Code',
        };
        return extLabels[ext] || 'File';
      };
      
      let successCount = 0;
      
      for (let i = 0; i < totalFiles; i++) {
        const file = selectedFiles[i];
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setUploadProgress(`Uploading ${i + 1}/${totalFiles}: (${fileSizeMB}MB)`);
        
        try {
          const url = await uploadFile(file);
          successCount++;
          // Use generic name like "PDF 1", "PDF 2" instead of actual file name
          const fileTypeLabel = getFileTypeLabel(file.name);
          const genericTitle = totalFiles === 1 ? fileTypeLabel : `${fileTypeLabel} ${successCount}`;
          uploadedResources.push({ title: genericTitle, fileUrl: url });
        } catch (fileError: any) {
          // If one file fails, show error but continue with others
          toast({
            title: `Failed: File ${i + 1}`,
            description: fileError.message,
            variant: "destructive",
          });
        }
      }
      
      setUploadProgress("");
      
      if (uploadedResources.length > 0) {
        addResourceMutation.mutate(uploadedResources);
      } else if (totalFiles > 0) {
        toast({
          title: "Upload Failed",
          description: "No files were uploaded successfully. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const invalidFiles: string[] = [];
      const validFiles: File[] = [];
      
      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          invalidFiles.push(error);
        } else {
          validFiles.push(file);
        }
      }
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid Files",
          description: invalidFiles.join('\n'),
          variant: "destructive",
        });
      }
      
      setSelectedFiles(validFiles);
    }
  };


  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      book: "Book",
    };
    return labels[type];
  };

  const getTypeIcon = (type: ResourceType) => {
    if (type === "notes") return <BookOpen className="h-4 w-4" />;
    if (type === "see") return <GraduationCap className="h-4 w-4" />;
    if (type === "book") return <Library className="h-4 w-4" />;
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

                <div className="space-y-2">
                  <Label>Resource Type</Label>
                  <Tabs value={resourceType} onValueChange={(v) => setResourceType(v as ResourceType)}>
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="cie1">CIE-1</TabsTrigger>
                      <TabsTrigger value="cie2">CIE-2</TabsTrigger>
                      <TabsTrigger value="cie3">CIE-3</TabsTrigger>
                      <TabsTrigger value="see">SEE</TabsTrigger>
                      <TabsTrigger value="book">Book</TabsTrigger>
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
                        <SelectItem value="none">No Unit (Books/QB)</SelectItem>
                        {units?.map((unit) => (
                          <SelectItem key={unit.id} value={unit.unit_number.toString()}>
                            Unit {unit.unit_number}: {unit.unit_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Title - Only shown for link mode */}
                {uploadMode === "link" && (
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      placeholder="e.g., Unit 1 Notes - Introduction"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Upload Mode Toggle */}
                <div className="space-y-2">
                  <Label>File Source</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={uploadMode === "link" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setUploadMode("link")}
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Google Drive Link
                    </Button>
                    <Button
                      type="button"
                      variant={uploadMode === "file" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setUploadMode("file")}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </div>

                {/* Google Drive URL */}
                {uploadMode === "link" && (
                  <div className="space-y-2">
                    <Label>Google Drive Link *</Label>
                    <Input
                      placeholder="https://drive.google.com/file/d/..."
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Make sure the file has "Anyone with the link can view" access
                    </p>
                  </div>
                )}

                {/* File Upload */}
                {uploadMode === "file" && (
                  <div className="space-y-2">
                    <Label>Select Files *</Label>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.c,.cpp,.py,.java,.js,.ts,.h"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {selectedFiles.length > 0 && (
                      <div className="space-y-1 mt-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          {selectedFiles.length} file(s) selected:
                        </p>
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-xs bg-muted/50 rounded px-2 py-1">
                            <span className="truncate flex-1 mr-2">{file.name}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-destructive hover:text-destructive"
                                onClick={() => removeFile(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {uploadProgress && (
                      <p className="text-xs text-primary font-medium">{uploadProgress}</p>
                    )}
                  </div>
                )}

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
                  disabled={addResourceMutation.isPending || isUploading}
                >
                  {(addResourceMutation.isPending || isUploading) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isUploading ? "Uploading..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {uploadMode === "file" && selectedFiles.length > 1 
                        ? `Add ${selectedFiles.length} Resources` 
                        : "Add Resource"}
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
