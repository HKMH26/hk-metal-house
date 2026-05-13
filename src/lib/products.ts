import { createClient } from "./supabase/server";

export interface Product {
  id: string;
  name: string;
  short_description: string;
  description: string;
  slug: string;
  primary_image: string;
  active: boolean;
  featured: boolean;
  price?: number | null;
  price_unit?: string | null;
  price_prefix?: string | null;
  show_price?: boolean | null;
  created_at: string;
  // Add other fields as needed
}

export async function getProducts(options: { limit?: number; activeOnly?: boolean } = {}) {
  const { limit, activeOnly = true } = options;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*");

  if (activeOnly) {
    query = query.eq("active", true);
  }

  query = query.order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}
