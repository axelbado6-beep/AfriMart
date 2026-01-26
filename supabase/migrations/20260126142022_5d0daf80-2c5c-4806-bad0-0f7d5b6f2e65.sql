-- Create a dedicated chat-media storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-media', 'chat-media', true);

-- Allow users to read chat media from their conversations
CREATE POLICY "Users can view chat media from their conversations"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'chat-media'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM conversations 
    WHERE client_id = auth.uid() 
    OR business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Allow users to upload chat media to their conversations
CREATE POLICY "Users can upload chat media to their conversations"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chat-media'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM conversations 
    WHERE client_id = auth.uid() 
    OR business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Allow users to update chat media they own (based on conversation membership)
CREATE POLICY "Users can update chat media in their conversations"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'chat-media'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM conversations 
    WHERE client_id = auth.uid() 
    OR business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Allow users to delete chat media from their conversations
CREATE POLICY "Users can delete chat media from their conversations"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chat-media'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM conversations 
    WHERE client_id = auth.uid() 
    OR business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  )
);