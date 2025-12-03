-- Add document_urls column for storing uploaded document paths
ALTER TABLE public.evisa_applications
ADD COLUMN IF NOT EXISTS document_urls jsonb DEFAULT '[]'::jsonb NOT NULL;

-- Create private storage bucket for e-visa documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('evisa-documents', 'evisa-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can upload e-visa documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view e-visa documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete e-visa documents" ON storage.objects;

-- RLS policies for e-visa documents bucket
-- Anyone (including unauthenticated applicants) can upload documents to this bucket
CREATE POLICY "Anyone can upload e-visa documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'evisa-documents');

-- Admins can view all e-visa documents
CREATE POLICY "Admins can view e-visa documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'evisa-documents' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete e-visa documents
CREATE POLICY "Admins can delete e-visa documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'evisa-documents' AND public.has_role(auth.uid(), 'admin'));