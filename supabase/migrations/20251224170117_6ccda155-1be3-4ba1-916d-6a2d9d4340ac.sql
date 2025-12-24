-- Create semesters table
CREATE TABLE public.semesters (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id SERIAL PRIMARY KEY,
  semester_id INTEGER NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  is_lab BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resource type enum
CREATE TYPE public.resource_type AS ENUM ('notes', 'qb', 'cie1', 'cie2', 'cie3', 'see', 'lab');

-- Create resources table
CREATE TABLE public.resources (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type public.resource_type NOT NULL,
  file_url TEXT NOT NULL,
  unit TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create public read policies (students don't need login)
CREATE POLICY "Anyone can view semesters" 
ON public.semesters 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view subjects" 
ON public.subjects 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view resources" 
ON public.resources 
FOR SELECT 
USING (true);

-- Create indexes for performance
CREATE INDEX idx_subjects_semester ON public.subjects(semester_id);
CREATE INDEX idx_resources_subject ON public.resources(subject_id);
CREATE INDEX idx_resources_type ON public.resources(type);