
-- Fix search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at=now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.enforce_doc_quota()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE total BIGINT;
BEGIN
  SELECT COALESCE(SUM(size_bytes),0) INTO total FROM public.documents WHERE user_id=NEW.user_id;
  IF total + NEW.size_bytes > 60*1024*1024 THEN
    RAISE EXCEPTION 'Document storage limit (60MB) exceeded';
  END IF;
  RETURN NEW;
END; $$;

-- Lock down has_role to authenticated callers only
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated, service_role;

-- Storage policies for documents bucket: user-scoped folder
CREATE POLICY "docs own read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id='documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "docs own insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id='documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "docs own update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id='documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "docs own delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id='documents' AND (storage.foldername(name))[1] = auth.uid()::text);
