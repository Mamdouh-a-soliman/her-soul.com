-- Update category_settings table to support image backgrounds and frame images
ALTER TABLE category_settings
DROP COLUMN IF EXISTS background_gradient,
DROP COLUMN IF EXISTS frame_color,
DROP COLUMN IF EXISTS frame_style,
DROP COLUMN IF EXISTS decorative_elements;

ALTER TABLE category_settings
ADD COLUMN background_image TEXT,
ADD COLUMN background_opacity NUMERIC DEFAULT 1.0 CHECK (background_opacity >= 0 AND background_opacity <= 1),
ADD COLUMN background_blur INTEGER DEFAULT 0,
ADD COLUMN frame_image TEXT;