-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view subjects" ON public.subjects;
DROP POLICY IF EXISTS "Only admins can delete subjects" ON public.subjects;
DROP POLICY IF EXISTS "Only admins can insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Only admins can update subjects" ON public.subjects;

-- Recreate as PERMISSIVE policies (default)
CREATE POLICY "Anyone can view subjects" 
ON public.subjects 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Only admins can delete subjects" 
ON public.subjects 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can insert subjects" 
ON public.subjects 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update subjects" 
ON public.subjects 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));