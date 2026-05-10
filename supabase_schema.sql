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

-- Create storage buckets
-- Note: These need to be created via Supabase Dashboard or API, but here are the names:
-- 1. product-images (Public)
-- 2. certificates (Public)

-- RLS (Row Level Security) - Basic Setup
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policies for public access (Read-only for public)
CREATE POLICY "Public products access" ON products FOR SELECT USING (active = true);
CREATE POLICY "Public product_images access" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public settings access" ON settings FOR SELECT USING (true);
CREATE POLICY "Public inquiries insert" ON inquiries FOR INSERT WITH CHECK (true);

-- Policies for admin access (Full access for authenticated users)
CREATE POLICY "Admin products full access" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin product_images full access" ON product_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin inquiries full access" ON inquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin settings full access" ON settings FOR ALL TO authenticated USING (true);
