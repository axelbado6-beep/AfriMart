ALTER TABLE public.business_profiles
  ADD COLUMN IF NOT EXISTS latitude numeric,
  ADD COLUMN IF NOT EXISTS longitude numeric,
  ADD COLUMN IF NOT EXISTS delivery_radius_km integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS delivery_fee_base integer NOT NULL DEFAULT 500,
  ADD COLUMN IF NOT EXISTS delivery_fee_per_km integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS delivery_mode text NOT NULL DEFAULT 'self';

CREATE INDEX IF NOT EXISTS idx_business_profiles_location
  ON public.business_profiles (latitude, longitude);