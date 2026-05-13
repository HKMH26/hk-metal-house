-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  specifications JSONB DEFAULT '[]'::jsonb,
  applications TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  primary_image TEXT,
  brochure_url TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_images table
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inquiries table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_name TEXT,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  quantity TEXT,
  message TEXT,
  status TEXT DEFAULT 'New', -- New, Contacted, Closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_reviews table
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title TEXT,
  review_text TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_approved ON product_reviews(approved);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for product-images bucket
-- Allow authenticated users to view files
DROP POLICY IF EXISTS "Authenticated users can view product images" ON storage.objects;
CREATE POLICY "Authenticated users can view product images" 
ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'product-images');

-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update files
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
CREATE POLICY "Authenticated users can update product images" 
ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

-- Allow authenticated users to delete files
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product images" 
ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- Allow public access to view images (important for the website)
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" 
ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- RLS (Row Level Security) - Basic Setup
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for public access (Read-only for public)
CREATE POLICY "Public products access" ON products FOR SELECT USING (active = true);
CREATE POLICY "Public product_images access" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public settings access" ON settings FOR SELECT USING (true);
CREATE POLICY "Public inquiries insert" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public approved reviews access" ON product_reviews FOR SELECT USING (approved = true);
CREATE POLICY "Public reviews insert" ON product_reviews FOR INSERT WITH CHECK (true);

-- Policies for admin access (Full access for authenticated users)
CREATE POLICY "Admin products full access" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin product_images full access" ON product_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin inquiries full access" ON inquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin settings full access" ON settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin product_reviews full access" ON product_reviews FOR ALL TO authenticated USING (true);
