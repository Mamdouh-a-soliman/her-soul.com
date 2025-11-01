-- Create category_settings table
CREATE TABLE public.category_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL UNIQUE,
  frame_enabled BOOLEAN DEFAULT false,
  frame_color TEXT DEFAULT 'amber-600',
  frame_style TEXT DEFAULT 'double',
  background_gradient TEXT DEFAULT '',
  decorative_elements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.category_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can view category settings
CREATE POLICY "Category settings are viewable by everyone"
ON public.category_settings
FOR SELECT
USING (true);

-- Only admins can manage category settings
CREATE POLICY "Admins can insert category settings"
ON public.category_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update category settings"
ON public.category_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete category settings"
ON public.category_settings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_category_settings_updated_at
BEFORE UPDATE ON public.category_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();