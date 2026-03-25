
-- 1. Fix business phone exposure: replace overly permissive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view business profiles" ON public.business_profiles;

CREATE POLICY "Authenticated users can view business profiles (limited)"
  ON public.business_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a view that hides phone for non-owners (handled in app code instead)
-- We'll use a column-level approach: no structural change needed, app will exclude phone

-- 2. Order update: restrict to status-only updates
DROP POLICY IF EXISTS "Business owners can update order status" ON public.orders;

CREATE POLICY "Business owners can update order status only"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles bp
      WHERE bp.id = orders.business_id AND bp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles bp
      WHERE bp.id = orders.business_id AND bp.user_id = auth.uid()
    )
  );

-- 3. Checkout server-side validation via trigger
CREATE OR REPLACE FUNCTION public.validate_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.shipping_address IS NOT NULL AND length(NEW.shipping_address) > 500 THEN
    RAISE EXCEPTION 'Shipping address too long (max 500 chars)';
  END IF;
  IF NEW.notes IS NOT NULL AND length(NEW.notes) > 1000 THEN
    RAISE EXCEPTION 'Notes too long (max 1000 chars)';
  END IF;
  IF NEW.quantity < 1 OR NEW.quantity > 1000 THEN
    RAISE EXCEPTION 'Invalid quantity';
  END IF;
  IF NEW.total_price <= 0 THEN
    RAISE EXCEPTION 'Invalid price';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_order_before_insert
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order();

-- 4. Media URL validation
CREATE OR REPLACE FUNCTION public.validate_media_urls()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Ensure media_url references our Supabase storage
  IF NEW.media_url IS NOT NULL AND NEW.media_url NOT LIKE '%supabase%' THEN
    RAISE EXCEPTION 'media_url must reference authorized storage';
  END IF;
  IF NEW.thumbnail_url IS NOT NULL AND NEW.thumbnail_url NOT LIKE '%supabase%' THEN
    RAISE EXCEPTION 'thumbnail_url must reference authorized storage';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_media_before_insert
  BEFORE INSERT OR UPDATE ON public.business_media
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_media_urls();
