import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import ProductCard from "@/components/ProductCard";
import ProductSearch from "@/components/ProductSearch";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { search } = await searchParams;
  if (search) {
    return {
      title: `Search Results for '${search}' | HK Metal House`,
      description: `Browse results for ${search} from HK Metal House's industrial components catalog.`,
    };
  }
  return {
    title: "Our Products - HK Metal House | Trusted Industrial Metal Supplier",
    description: "Explore our wide range of precision-engineered brass, stainless steel, and aluminum components.",
  };
}

export const revalidate = 0;

export default async function ProductsPage({ searchParams }: PageProps) {
  const { search } = await searchParams;
  const supabase = await createClient();

  let queryBuilder = supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (search) {
    queryBuilder = queryBuilder.or(`name.ilike.%${search}%,category.ilike.%${search}%,short_description.ilike.%${search}%,full_description.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  const { data: products } = await queryBuilder;

  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title={search ? "Search Results" : "Our Products"} 
          subtitle={search ? `Showing results for "${search}"` : "Precision Engineered Components"} 
        />
        
        <Section bg="white">
          <div className="mb-16">
            <div className="max-w-xl mx-auto">
              <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Search Catalog</p>
              <ProductSearch placeholder="Search by name, category or description..." />
            </div>
          </div>

          {!search && (
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="text-3xl font-bold mb-6">Explore Our Comprehensive Range</h2>
              <p className="text-gray-600 text-lg">
                We offer a wide variety of high-quality metal components designed to meet the rigorous demands of various industries including automotive, aerospace, construction, and electronics.
              </p>
            </div>
          )}
          
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id}
                  title={product.name}
                  description={product.short_description}
                  image={product.primary_image || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600&h=400"}
                  slug={product.slug}
                  index={index}
                  price={product.price}
                  price_unit={product.price_unit}
                  price_prefix={product.price_prefix}
                  show_price={product.show_price}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <div className="max-w-md mx-auto">
                <p className="text-gray-500 text-lg mb-2 font-bold">No products found</p>
                <p className="text-gray-400 mb-8">We couldn't find any products matching your search criteria. Please try a different term or contact us for custom sourcing.</p>
                <a 
                  href="/products" 
                  className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                >
                  View All Products
                </a>
              </div>
            </div>
          )}
        </Section>

        {/* Custom Sourcing CTA */}
        <Section bg="dark" className="py-16">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6">Need a Specific Component?</h3>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
              Through our extensive supplier network, we can source custom metal components tailored to your exact specifications and quality requirements.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-white text-primary px-10 py-4 rounded-md font-bold hover:bg-accent transition-all"
            >
              Get a Sourcing Quote
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
