-- Create storage bucket for resources
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload resources"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resources');

-- Allow anyone to view resources (public bucket)
CREATE POLICY "Anyone can view resources"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resources');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete resources"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'resources');