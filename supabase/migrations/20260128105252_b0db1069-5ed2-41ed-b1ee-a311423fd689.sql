-- Create index for efficient story queries
CREATE INDEX IF NOT EXISTS idx_business_media_stories 
ON public.business_media (business_id, media_type, expires_at) 
WHERE media_type = 'story';

-- Create general index for stories ordered by date
CREATE INDEX IF NOT EXISTS idx_business_media_stories_created 
ON public.business_media (created_at DESC) 
WHERE media_type = 'story';