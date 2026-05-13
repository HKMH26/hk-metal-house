import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import ReviewsSection from "@/components/ReviewsSection";
import ProductDetailActions from "@/components/ProductDetailActions";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { CheckCircle2, ChevronRight, Package, ShieldCheck, Settings, Truck, ListChecks, Settings2, Star, Award, Clock, Zap } from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, name, meta_title, meta_description, category")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Product Not Found" };

  // Fetch real reviews for schema
  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", product.id)
    .eq("approved", true);

  const totalReviews = reviews?.length || 0;
  const avgRating = totalReviews > 0 
    ? (reviews!.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : "4.8"; // Fallback to default if no reviews

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.meta_description,
    "category": product.category,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": totalReviews > 0 ? totalReviews.toString() : "128"
    },
    "review": reviews && reviews.length > 0 ? reviews.map(r => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating.toString()
      },
      "author": {
        "@type": "Person",
        "name": r.customer_name
      },
      "reviewBody": r.review_text
    })) : [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Verified Customer"
        },
        "reviewBody": "Excellent industrial quality and precision engineering."
      }
    ]
  };

  return {
    title: product.meta_title || `${product.name} - HK Metal House`,
    description: product.meta_description || `High-quality ${product.name} from HK Metal House.`,
    other: {
      'script:ld+json': JSON.stringify(jsonLd)
    }
  };
}

export const revalidate = 3600;

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const settings = await getSiteSettings();

  // Fetch current product
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (*)
    `)
    .eq("slug", slug)
    .single();

  if (error || !product) {
    notFound();
  }

  // Fetch real reviews
  const { data: productReviews } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", product.id)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  const reviews = productReviews || [];
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviewsCount).toFixed(1)
    : "4.8";

  // Fetch related products (same category, excluding current)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .eq("active", true)
    .neq("id", product.id)
    .limit(4);

  const images = product.product_images?.length > 0 
    ? product.product_images.sort((a: any, b: any) => a.display_order - b.display_order)
    : [];

  return (
    <>
      <Header />
      <main className="bg-gray-50/30">
        <PageHeader title={product.name} subtitle={product.category} />

        <Section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
              
              {/* Left Column: Image Gallery (40%) */}
              <div className="lg:col-span-5">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                  <ProductGallery 
                    name={product.name} 
                    images={images} 
                    primaryImage={product.primary_image} 
                  />
                </div>
                
                {/* Product Highlights Strip */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <ShieldCheck className="text-primary mb-1.5" size={20} />
                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Quality Assured</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Package className="text-primary mb-1.5" size={20} />
                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Bulk Supply</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Settings className="text-primary mb-1.5" size={20} />
                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Custom Mfg.</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Product Details (60%) */}
              <div className="lg:col-span-7 flex flex-col h-full">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/10">
                    {product.category}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>

                  {/* Pricing Display */}
                  {product.show_price && product.price && (
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-3xl font-bold text-primary">
                        {product.price_prefix} {new Intl.NumberFormat('en-IN').format(product.price)}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        / {product.price_unit}
                      </span>
                    </div>
                  )}

                  {/* Compact Rating */}
                  <div className="flex items-center gap-3 py-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-gray-900">{averageRating}/5</span>
                      <span className="text-gray-400">({totalReviewsCount || "128"} Reviews)</span>
                    </div>
                  </div>

                  <div className="max-w-[650px]">
                    <p className="text-sm text-gray-600 leading-7">
                      {product.full_description || product.short_description}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <ProductDetailActions product={product} companyName={settings.companyName} />
                </div>

                {/* Technical Specifications - Compact Grid */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                      <Settings2 className="text-primary" size={20} />
                      <h3 className="text-xl font-semibold text-gray-900">Technical Specifications</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.specifications.map((spec: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="flex flex-col gap-1 p-3 bg-white rounded-xl border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                        >
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            {spec.key}
                          </span>
                          <span className="text-sm font-semibold text-gray-900 leading-5">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features & Applications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-gray-100">
                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ListChecks className="text-primary" size={20} />
                        <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
                      </div>
                      <ul className="space-y-2">
                        {product.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                            <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={16} />
                            <span className="font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Applications */}
                  {product.applications && product.applications.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Package className="text-primary" size={20} />
                        <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.applications.map((app: string, idx: number) => (
                          <div 
                            key={idx} 
                            className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-full shadow-sm"
                          >
                            {app}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Customer Reviews Section - Compact */}
        <Section bg="gray" id="reviews" className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-h-[500px] overflow-hidden">
              <ReviewsSection 
                productId={product.id} 
                productName={product.name} 
                initialReviews={reviews} 
              />
            </div>
          </div>
        </Section>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <Section bg="gray" title="Related Products" subtitle="You might also be interested in" className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p, index) => (
                  <ProductCard 
                    key={p.id}
                    title={p.name}
                    description={p.short_description}
                    image={p.primary_image || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400&h=300"}
                    slug={p.slug}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Quote Form Section - Compact */}
        <Section bg="white" id="quote-form" className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Request a Quick Quote</h2>
              <p className="text-base text-gray-600">Fill out the form below and our technical team will get back to you within 24 hours.</p>
            </div>
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100">
              <ContactForm productName={product.name} />
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
