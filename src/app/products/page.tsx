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
          <div className="mb-12 md:mb-16">
            <div className="max-w-xl mx-auto">
              <p className="text-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Search Catalog</p>
              <div className="shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                <ProductSearch placeholder="Search by name, category or description..." />
              </div>
            </div>
          </div>

          {!search && (
            <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20 px-4">
              <h2 className="text-2xl sm:text-4xl font-bold mb-6 text-[#0B3D91]">Explore Our Comprehensive Range</h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                We offer a wide variety of high-quality metal components designed to meet the rigorous demands of various industries including automotive, aerospace, construction, and electronics.
              </p>
            </div>
          )}
          
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-10">
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
            <div className="text-center py-16 md:py-20 bg-gray-50 rounded-2xl md:rounded-3xl border border-dashed border-gray-200">
              <div className="max-w-md mx-auto px-4">
                <p className="text-gray-500 text-lg mb-2 font-bold uppercase tracking-wider">No products found</p>
                <p className="text-gray-400 mb-8 text-sm sm:text-base leading-relaxed">We couldn't find any products matching your search criteria. Please try a different term or contact us for custom sourcing.</p>
                <a 
                  href="/products" 
                  className="inline-flex items-center gap-2 text-[#0B3D91] font-bold hover:text-[#D4AF37] transition-colors"
                >
                  View All Products
                </a>
              </div>
            </div>
          )}
        </Section>

        {/* Custom Sourcing CTA */}
        <Section bg="dark" className="py-12 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-bold mb-6 text-white uppercase tracking-wider">Need a Specific Component?</h3>
            <p className="text-gray-300 mb-10 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Through our extensive supplier network, we can source custom metal components tailored to your exact specifications and quality requirements.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-white text-[#0B3D91] px-8 sm:px-12 py-4 rounded-xl font-bold hover:bg-[#D4AF37] hover:text-[#0B3D91] transition-all duration-300 shadow-xl"
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
