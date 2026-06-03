-- ============================================
-- PROJECT FILES: Supabase Storage setup
-- ============================================

-- NOTE:
-- Supabase storage buckets are stored in the "storage" schema.
-- This migration creates bucket `project-files` if it doesn't exist
-- and configures permissive RLS-like policies via storage RBAC.
-- You may need to run this in the Supabase SQL editor with access
-- to storage tables.

-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage folder convention
-- We will store uploaded objects under:
--   project-files/project_<projectId>/<categoryFolder>/<generated_uuid>_<original_file_name>
-- Example:
--   project-files/project_123/contracts/contract.pdf
--
-- Where categoryFolder is:
--   contracts, reports, invoices, designs, assets, source-code, other

-- ============================================
-- Storage object access policies
-- ============================================
-- Supabase Storage policies are applied on storage.objects.

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Admins: full access
CREATE POLICY "Admins can access project-files objects"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'project-files'
    AND auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  )
  WITH CHECK (
    bucket_id = 'project-files'
    AND auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Members: can read; can upload; cannot delete (no delete policy)
CREATE POLICY "Members can select project-files objects"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'project-files'
    AND auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin','member')
    )
  );

CREATE POLICY "Members can insert project-files objects"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'project-files'
    AND auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin','member')
    )
  );

-- Clients: can only read objects in folders for allowed categories
-- and belonging to their project.
-- NOTE:
-- We rely on folder path containing `project_<projectId>`.
-- If your path format changes, adjust the LIKE/regex.

CREATE POLICY "Clients can select allowed project-files objects"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'project-files'
    AND auth.uid() IN (SELECT id FROM client_users WHERE role = 'client')
    AND EXISTS (
      SELECT 1
      FROM projects p
      JOIN clients c ON c.id = p.client_id
      JOIN client_users cu ON cu.id = c.id
      WHERE cu.id = auth.uid()
        AND (objects.name LIKE ('project_' || p.id::text || '/%'))
    )
    AND (
      objects.name ILIKE '%/contracts/%'
      OR objects.name ILIKE '%/reports/%'
      OR objects.name ILIKE '%/invoices/%'
    )
  );

