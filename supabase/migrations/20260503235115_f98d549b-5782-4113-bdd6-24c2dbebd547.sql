
-- 1. Restrict phone column on business_profiles via column-level grants
REVOKE SELECT ON public.business_profiles FROM anon, authenticated;
GRANT SELECT (id, user_id, business_name, description, category, logo_url, banner_url, location, country, opening_hours, is_verified, followers_count, created_at, updated_at)
  ON public.business_profiles TO anon, authenticated;

-- Security definer function to expose phone only to owner or active conversation participants
CREATE OR REPLACE FUNCTION public.get_business_phone(_business_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _phone text;
  _allowed boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.business_profiles bp
    WHERE bp.id = _business_id AND bp.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.business_id = _business_id AND c.client_id = auth.uid()
  ) INTO _allowed;

  IF NOT _allowed THEN
    RETURN NULL;
  END IF;

  SELECT phone INTO _phone FROM public.business_profiles WHERE id = _business_id;
  RETURN _phone;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_business_phone(uuid) TO authenticated;

-- 2. Attach order validation trigger
DROP TRIGGER IF EXISTS validate_order_before_insert ON public.orders;
CREATE TRIGGER validate_order_before_insert
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.validate_order();

-- 3. Strengthen media URL validation: include business folder check
CREATE OR REPLACE FUNCTION public.validate_media_urls()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.media_url IS NULL OR NEW.media_url NOT LIKE '%supabase%' THEN
    RAISE EXCEPTION 'media_url must reference authorized storage';
  END IF;
  IF NEW.media_url NOT LIKE '%/' || NEW.business_id::text || '/%' THEN
    RAISE EXCEPTION 'media_url must be in the business''s own storage folder';
  END IF;
  IF NEW.thumbnail_url IS NOT NULL THEN
    IF NEW.thumbnail_url NOT LIKE '%supabase%' THEN
      RAISE EXCEPTION 'thumbnail_url must reference authorized storage';
    END IF;
    IF NEW.thumbnail_url NOT LIKE '%/' || NEW.business_id::text || '/%' THEN
      RAISE EXCEPTION 'thumbnail_url must be in the business''s own storage folder';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_media_before_insert ON public.business_media;
CREATE TRIGGER validate_media_before_insert
  BEFORE INSERT OR UPDATE ON public.business_media
  FOR EACH ROW EXECUTE FUNCTION public.validate_media_urls();

-- 4. Restrict order updates by businesses to status field only (via trigger using OLD)
CREATE OR REPLACE FUNCTION public.restrict_order_business_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  _is_business_owner boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.business_profiles bp
    WHERE bp.id = OLD.business_id AND bp.user_id = auth.uid()
  ) INTO _is_business_owner;

  -- If updater is the business owner (not the client), restrict to status changes only
  IF _is_business_owner AND auth.uid() <> OLD.client_id THEN
    IF NEW.business_id IS DISTINCT FROM OLD.business_id
       OR NEW.client_id IS DISTINCT FROM OLD.client_id
       OR NEW.product_id IS DISTINCT FROM OLD.product_id
       OR NEW.quantity IS DISTINCT FROM OLD.quantity
       OR NEW.total_price IS DISTINCT FROM OLD.total_price
       OR NEW.currency IS DISTINCT FROM OLD.currency
       OR NEW.shipping_address IS DISTINCT FROM OLD.shipping_address
       OR NEW.notes IS DISTINCT FROM OLD.notes THEN
      RAISE EXCEPTION 'Business owners can only update order status';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS restrict_order_business_update_trigger ON public.orders;
CREATE TRIGGER restrict_order_business_update_trigger
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.restrict_order_business_update();

-- 5. Tighten order SELECT policies to authenticated role only
DROP POLICY IF EXISTS "Clients can view their own orders" ON public.orders;
CREATE POLICY "Clients can view their own orders"
ON public.orders FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Business owners can view orders for their business" ON public.orders;
CREATE POLICY "Business owners can view orders for their business"
ON public.orders FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.business_profiles bp
  WHERE bp.id = orders.business_id AND bp.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Clients can create orders" ON public.orders;
CREATE POLICY "Clients can create orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);
