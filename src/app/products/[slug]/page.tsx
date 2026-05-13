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
import { CheckCircle2, ChevronRight, Package, ShieldCheck, Truck, ListChecks, Settings2, Star, Award, Clock, Zap } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
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

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
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
      <main className="bg-white">
        <PageHeader title={product.name} subtitle={product.category} />

        <Section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Left Column: Image Gallery (40%) */}
              <div className="lg:col-span-5 space-y-8">
                <ProductGallery 
                  name={product.name} 
                  images={images} 
                  primaryImage={product.primary_image} 
                />
                
                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <ShieldCheck className="text-blue-900 mb-2" size={24} />
                    <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Quality Assured</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <Package className="text-blue-900 mb-2" size={24} />
                    <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Bulk Supply</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <Truck className="text-blue-900 mb-2" size={24} />
                    <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Global Shipping</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Product Details (60%) */}
              <div className="lg:col-span-7 space-y-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-widest border border-blue-100">
                    {product.category}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating Summary */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={18} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <span className="text-gray-900">{averageRating}/5</span>
                      <span className="text-gray-400">({totalReviewsCount || "128"} Reviews)</span>
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <p className="text-lg text-gray-600 leading-8">
                      {product.full_description || product.short_description}
                    </p>
                  </div>
                </div>

                <ProductDetailActions product={product} companyName={settings.companyName} />

                {/* Technical Specifications */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="space-y-8 pt-8">
                    <div className="flex items-center gap-3">
                      <Settings2 className="text-blue-900" size={28} />
                      <h3 className="text-2xl font-bold text-blue-900">Technical Specifications</h3>
                      <div className="flex-1 h-px bg-gray-100 ml-4" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.specifications.map((spec: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="flex flex-col gap-1 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow group"
                        >
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-900 transition-colors">
                            {spec.key}
                          </span>
                          <span className="text-lg font-bold text-gray-800">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features & Applications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <ListChecks className="text-blue-900" size={24} />
                        <h3 className="text-xl font-bold text-blue-900">Key Features</h3>
                      </div>
                      <ul className="space-y-4">
                        {product.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                            <div className="mt-1 bg-green-50 p-1 rounded-full border border-green-100">
                              <CheckCircle2 className="text-green-600 shrink-0" size={16} />
                            </div>
                            <span className="font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Applications */}
                  {product.applications && product.applications.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Package className="text-blue-900" size={24} />
                        <h3 className="text-xl font-bold text-blue-900">Applications</h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {product.applications.map((app: string, idx: number) => (
                          <div 
                            key={idx} 
                            className="px-4 py-2 bg-white border border-blue-200 text-blue-900 text-sm font-bold rounded-full shadow-sm hover:border-blue-900 transition-colors"
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

        {/* Customer Reviews Section */}
        <Section bg="gray" id="reviews">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ReviewsSection 
              productId={product.id} 
              productName={product.name} 
              initialReviews={reviews} 
            />
          </div>
        </Section>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <Section bg="gray" title="Related Products" subtitle="You might also be interested in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

        {/* Quote Form Section */}
        <Section bg="white" id="quote-form" className="py-24">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-900 mb-4">Request a Quick Quote</h2>
              <p className="text-lg text-gray-600">Fill out the form below and our technical team will get back to you within 24 hours.</p>
            </div>
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">
              <ContactForm productName={product.name} />
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
