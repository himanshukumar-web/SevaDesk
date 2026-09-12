-- ==============================================================================
-- SevaDesk Supabase Storage Buckets & Policies Setup
-- ==============================================================================

-- 1. Create Buckets
-- 'documents': Private bucket for sensitive citizen application drafts, identity proofs, PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('documents', 'documents', false, 15728640, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 15728640;

-- 'avatars': Public bucket for user and operator profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880;

-- 'templates': Public bucket for standardized blank government document templates
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('templates', 'templates', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- ==============================================================================
-- 2. Storage Security Policies (storage.objects)
-- ==============================================================================

-- Documents Bucket (Strict Private Isolation)
-- Users can read their own documents or Super Admin
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR (storage.foldername(name))[1] = (SELECT id FROM public."User" WHERE "supabaseAuthId" = auth.uid()::text LIMIT 1)
  )
);

-- Users can upload documents to their own folder
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR (storage.foldername(name))[1] = (SELECT id FROM public."User" WHERE "supabaseAuthId" = auth.uid()::text LIMIT 1)
  )
);

-- Avatars Bucket
CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid() IS NOT NULL
);

-- Templates Bucket
CREATE POLICY "Templates are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'templates');

CREATE POLICY "Super Admins can manage templates"
ON storage.objects FOR ALL
USING (
  bucket_id = 'templates'
  AND (
    SELECT role FROM public."User" WHERE "supabaseAuthId" = auth.uid()::text LIMIT 1
  ) = 'SUPER_ADMIN'
);
