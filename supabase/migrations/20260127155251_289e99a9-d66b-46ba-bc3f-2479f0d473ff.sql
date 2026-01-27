-- Drop the existing restrictive SELECT policies
DROP POLICY IF EXISTS "Business owners can view all their products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

-- Create a proper policy for business owners to view ALL their products (available or not)
CREATE POLICY "Business owners can view all their products"
ON products FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM business_profiles bp
    WHERE bp.id = products.business_id AND bp.user_id = auth.uid()
  )
);

-- Create a policy for everyone to view available products
CREATE POLICY "Available products are viewable by everyone"
ON products FOR SELECT
USING (is_available = true);

-- Also fix orders policy - clients should see their orders
-- The existing policy seems correct but let's make sure it's permissive
DROP POLICY IF EXISTS "Clients can view their own orders" ON orders;
CREATE POLICY "Clients can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = client_id);

-- Ensure business owners can view orders for their business
DROP POLICY IF EXISTS "Business owners can view orders for their business" ON orders;
CREATE POLICY "Business owners can view orders for their business"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM business_profiles bp
    WHERE bp.id = orders.business_id AND bp.user_id = auth.uid()
  )
);