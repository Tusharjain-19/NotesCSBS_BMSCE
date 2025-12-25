-- Create units table to store unit names for each subject
CREATE TABLE public.units (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  unit_number INTEGER NOT NULL CHECK (unit_number >= 1 AND unit_number <= 5),
  unit_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(subject_id, unit_number)
);

-- Enable RLS
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view units" ON public.units FOR SELECT USING (true);

-- Create index for faster lookups
CREATE INDEX idx_units_subject_id ON public.units(subject_id);