-- Drop existing restrictive policies for resources table
DROP POLICY IF EXISTS "Anyone can view resources" ON public.resources;
DROP POLICY IF EXISTS "Only admins can delete resources" ON public.resources;
DROP POLICY IF EXISTS "Only admins can insert resources" ON public.resources;
DROP POLICY IF EXISTS "Only admins can update resources" ON public.resources;

-- Create new PERMISSIVE policies for resources table
CREATE POLICY "Anyone can view resources" 
ON public.resources 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Only admins can delete resources" 
ON public.resources 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can insert resources" 
ON public.resources 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update resources" 
ON public.resources 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));