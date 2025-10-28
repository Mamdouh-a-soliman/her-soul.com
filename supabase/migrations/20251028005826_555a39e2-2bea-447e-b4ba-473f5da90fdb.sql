-- Add new fields to products table for featured, ordering, and discount pricing
ALTER TABLE public.products
ADD COLUMN featured boolean DEFAULT false,
ADD COLUMN sort_order integer DEFAULT 0,
ADD COLUMN discount_price numeric;

-- Create index for featured products
CREATE INDEX idx_products_featured ON public.products(featured) WHERE featured = true;

-- Create index for sort order
CREATE INDEX idx_products_sort_order ON public.products(sort_order);