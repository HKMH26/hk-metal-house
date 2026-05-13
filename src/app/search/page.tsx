import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import ProductCard from "@/components/ProductCard";
import GlobalSearch from "@/components/GlobalSearch";
import { createClient } from "@/lib/supabase/server";
import { FileText, ArrowRight, Search, Info, Settings, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  if (q) {
    return {
      title: `Search Results for '${q}' | HK Metal House`,
      description: `Browse search results for "${q}" across products, services, and information pages of HK Metal House.`,
    };
  }
  return {
    title: "Search | HK Metal House",
    description: "Search for industrial metal components, services, and information.",
  };
}

const STATIC_PAGES = [
  { title: "About Us", slug: "/about", description: "Learn more about HK Metal House history and mission.", type: "page" as const },
  { title: "Quality Assurance", slug: "/quality", description: "Our commitment to high-quality industrial standards.", type: "page" as const },
  { title: "Certifications", slug: "/certifications", description: "View our ISO and other industrial certifications.", type: "page" as const },
  { title: "Contact Us", slug: "/contact", description: "Get in touch with our team for inquiries.", type: "page" as const },
];

export const revalidate = 0;

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();

  // 1. Search Products
  let productsQuery = supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (q) {
    productsQuery = productsQuery.or(`name.ilike.%${q}%,category.ilike.%${q}%,short_description.ilike.%${q}%,full_description.ilike.%${q}%`);
  }
  const { data: products = [] } = await productsQuery;

  // 2. Search Static Pages
  const matchedPages = q 
    ? STATIC_PAGES.filter(page => 
        page.title.toLowerCase().includes(q.toLowerCase()) || 
        page.description.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  const totalResults = (products?.length || 0) + matchedPages.length;

  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title="Search Results" 
          subtitle={q ? `Found ${totalResults} results for "${q}"` : "Search our website"} 
        />
        
        <Section bg="white">
          <div className="max-w-2xl mx-auto mb-20">
            <GlobalSearch placeholder="Search products, services, or pages..." />
          </div>

          {totalResults > 0 ? (
            <div className="space-y-20">
              {/* Products Section */}
              {products && products.length > 0 && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Settings className="text-primary" size={24} />
                      Matching Products ({products.length})
                    </h2>
                    <Link href="/products" className="text-sm font-bold text-primary hover:underline">
                      View All Products
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                </div>
              )}

              {/* Pages Section */}
              {matchedPages.length > 0 && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="text-primary" size={24} />
                      Information Pages ({matchedPages.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matchedPages.map((page) => (
                      <Link 
                        key={page.slug}
                        href={page.slug}
                        className="group flex gap-6 p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all"
                      >
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm shrink-0">
                          <Info size={32} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                            {page.title}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {page.description}
                          </p>
                          <span className="inline-flex items-center gap-2 text-primary font-bold text-sm">
                            Learn More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Search className="text-gray-200" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
                <p className="text-gray-500 mb-10 leading-relaxed">
                  We couldn't find anything matching "{q}". Please try different keywords or browse our product categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/products" 
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary transition-all"
                  >
                    Browse Products
                  </Link>
                  <Link 
                    href="/contact" 
                    className="bg-white text-primary border border-gray-200 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}
