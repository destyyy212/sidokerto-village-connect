DROP POLICY IF EXISTS "Sidokerto admin uploads" ON storage.objects;
DROP POLICY IF EXISTS "Sidokerto admin updates uploads" ON storage.objects;
DROP POLICY IF EXISTS "Sidokerto admin deletes uploads" ON storage.objects;
DROP POLICY IF EXISTS "Sidokerto media read for linked content" ON storage.objects;
CREATE POLICY "Sidokerto admin uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sidokerto-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Sidokerto admin updates uploads" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'sidokerto-media' AND public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (bucket_id = 'sidokerto-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Sidokerto admin deletes uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'sidokerto-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Sidokerto media read for linked content" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'sidokerto-media');