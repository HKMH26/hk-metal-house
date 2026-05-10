import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
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
