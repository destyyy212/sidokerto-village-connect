DROP POLICY IF EXISTS "Sidokerto media read for linked content" ON storage.objects;
DROP POLICY IF EXISTS "Sidokerto admins read uploads" ON storage.objects;
CREATE POLICY "Sidokerto admins read uploads" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'sidokerto-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));