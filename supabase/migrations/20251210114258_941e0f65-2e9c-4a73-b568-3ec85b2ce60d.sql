-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  category TEXT,
  images TEXT[] DEFAULT '{}',
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Products are viewable by everyone"
ON public.products FOR SELECT
USING (is_available = true);

CREATE POLICY "Business owners can view all their products"
ON public.products FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.business_profiles bp
    WHERE bp.id = business_id AND bp.user_id = auth.uid()
  )
);

CREATE POLICY "Business owners can insert products"
ON public.products FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.business_profiles bp
    WHERE bp.id = business_id AND bp.user_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update their products"
ON public.products FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.business_profiles bp
    WHERE bp.id = business_id AND bp.user_id = auth.uid()
  )
);

CREATE POLICY "Business owners can delete their products"
ON public.products FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.business_profiles bp
    WHERE bp.id = business_id AND bp.user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Storage policies
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Business users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Business users can update their product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Business users can delete their product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');