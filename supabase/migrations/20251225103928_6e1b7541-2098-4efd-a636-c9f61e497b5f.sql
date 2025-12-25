-- Drop existing permissive storage policies
DROP POLICY IF EXISTS "Authenticated users can upload resources" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete resources" ON storage.objects;

-- Create admin-only upload policy
CREATE POLICY "Only admins can upload resources"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'));

-- Create admin-only delete policy
CREATE POLICY "Only admins can delete resources"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'));