-- Add phone column to business_profiles if not exists
ALTER TABLE public.business_profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create reviews table for client ratings
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, business_id, product_id)
);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can view reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

-- Clients can create reviews
CREATE POLICY "Clients can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = client_id);

-- Clients can update their own reviews
CREATE POLICY "Clients can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = client_id);

-- Clients can delete their own reviews
CREATE POLICY "Clients can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = client_id);

-- Create trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create business_media table for reels and lives
CREATE TYPE public.media_type AS ENUM ('photo', 'reel', 'live');

CREATE TABLE public.business_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  media_type public.media_type NOT NULL,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  views_count INTEGER NOT NULL DEFAULT 0,
  likes_count INTEGER NOT NULL DEFAULT 0,
  is_live BOOLEAN NOT NULL DEFAULT false,
  live_viewers INTEGER NOT NULL DEFAULT 0,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on business_media
ALTER TABLE public.business_media ENABLE ROW LEVEL SECURITY;

-- Everyone can view published media
CREATE POLICY "Media is viewable by everyone" 
ON public.business_media 
FOR SELECT 
USING (true);

-- Business owners can insert their media
CREATE POLICY "Business owners can insert media" 
ON public.business_media 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.business_profiles bp 
  WHERE bp.id = business_id AND bp.user_id = auth.uid()
));

-- Business owners can update their media
CREATE POLICY "Business owners can update their media" 
ON public.business_media 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.business_profiles bp 
  WHERE bp.id = business_id AND bp.user_id = auth.uid()
));

-- Business owners can delete their media
CREATE POLICY "Business owners can delete their media" 
ON public.business_media 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.business_profiles bp 
  WHERE bp.id = business_id AND bp.user_id = auth.uid()
));