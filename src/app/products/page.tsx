import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Our Products - HK Metal House | Trusted Industrial Metal Supplier",
  description: "Explore our wide range of precision-engineered brass, stainless steel, and aluminum components.",
};

export default async function ProductsPage() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />
      <main>
        <PageHeader title="Our Products" subtitle="Precision Engineered Components" />
        
        <Section bg="white">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-3xl font-bold mb-6">Explore Our Comprehensive Range</h2>
            <p className="text-gray-600 text-lg">
              We offer a wide variety of high-quality metal components designed to meet the rigorous demands of various industries including automotive, aerospace, construction, and electronics.
            </p>
          </div>
          
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
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products available at the moment. Please check back later.</p>
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
