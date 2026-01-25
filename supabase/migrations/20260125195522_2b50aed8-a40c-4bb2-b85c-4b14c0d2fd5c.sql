-- Drop existing overly permissive storage policies for products bucket
DROP POLICY IF EXISTS "Business users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Business users can update their product images" ON storage.objects;
DROP POLICY IF EXISTS "Business users can delete their product images" ON storage.objects;

-- Create secure policies that validate businessId ownership
-- Only business owners can upload to their folder (folder name = business_profiles.id)
CREATE POLICY "Business owners can upload to their folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.business_profiles WHERE user_id = auth.uid()
  )
);

-- Only business owners can update their files
CREATE POLICY "Business owners can update their files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.business_profiles WHERE user_id = auth.uid()
  )
);

-- Only business owners can delete their files
CREATE POLICY "Business owners can delete their files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.business_profiles WHERE user_id = auth.uid()
  )
);