import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (*)
    `)
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductForm initialData={product} isEditing={true} />;
}
