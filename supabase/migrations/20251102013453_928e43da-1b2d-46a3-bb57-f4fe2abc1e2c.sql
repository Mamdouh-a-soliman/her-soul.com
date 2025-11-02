-- Create gallery table
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Gallery items are viewable by everyone
CREATE POLICY "Gallery items are viewable by everyone"
ON public.gallery
FOR SELECT
USING (true);

-- Admins can insert gallery items
CREATE POLICY "Admins can insert gallery items"
ON public.gallery
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update gallery items
CREATE POLICY "Admins can update gallery items"
ON public.gallery
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete gallery items
CREATE POLICY "Admins can delete gallery items"
ON public.gallery
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gallery_updated_at
BEFORE UPDATE ON public.gallery
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();