
CREATE TABLE public.product_supplements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  stripe_session_id text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.product_supplements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view their supplements"
  ON public.product_supplements
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM business_profiles bp
    WHERE bp.id = product_supplements.business_id
      AND bp.user_id = auth.uid()
  ));
