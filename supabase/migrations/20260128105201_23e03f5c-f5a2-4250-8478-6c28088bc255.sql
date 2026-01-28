-- Add 'story' to the media_type enum
ALTER TYPE public.media_type ADD VALUE IF NOT EXISTS 'story';

-- Add expires_at column for configurable story duration
ALTER TABLE public.business_media 
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone DEFAULT NULL;

-- Add duration_type column to track the chosen expiration setting
ALTER TABLE public.business_media 
ADD COLUMN IF NOT EXISTS duration_type text DEFAULT 'permanent' 
CHECK (duration_type IN ('24h', '48h', 'permanent'));