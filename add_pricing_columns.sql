-- Update products table to add pricing columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS price NUMERIC(12,2), 
ADD COLUMN IF NOT EXISTS price_unit TEXT DEFAULT 'Piece', 
ADD COLUMN IF NOT EXISTS price_prefix TEXT DEFAULT '₹', 
ADD COLUMN IF NOT EXISTS show_price BOOLEAN DEFAULT TRUE;
