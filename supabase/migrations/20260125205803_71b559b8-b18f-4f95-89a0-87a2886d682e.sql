-- Fix 1: Remove public SELECT on profiles table (conflicting policy)
-- Keep only owner-access policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Fix 2: Remove public SELECT on business_profiles and require authentication
DROP POLICY IF EXISTS "Public business profiles are viewable by everyone" ON public.business_profiles;

-- Create new policy: Only authenticated users can view business profiles
CREATE POLICY "Authenticated users can view business profiles"
ON public.business_profiles
FOR SELECT
TO authenticated
USING (true);

-- The existing "Users can view their own profile" policy on profiles table remains
-- This ensures users can only see their own profile data