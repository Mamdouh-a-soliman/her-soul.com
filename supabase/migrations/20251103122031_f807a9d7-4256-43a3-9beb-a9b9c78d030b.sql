-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Allow everyone to view media files
CREATE POLICY "Media files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow admins to upload media files
CREATE POLICY "Admins can upload media files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

-- Allow admins to update media files
CREATE POLICY "Admins can update media files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

-- Allow admins to delete media files
CREATE POLICY "Admins can delete media files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);