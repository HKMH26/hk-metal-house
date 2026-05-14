import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import ProductCard from "@/components/ProductCard";
import ContactForm from "@/components/ContactForm";
import GoogleMap from "@/components/GoogleMap";
import { companyInfo, whyChooseUs } from "@/data/company";
import { qualityStandards } from "@/data/quality";
import { certifications } from "@/data/certifications";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { getProducts } from "@/lib/products";
import { ShieldCheck, Settings, Users, Globe, ArrowRight, Award, Warehouse, Phone, Mail, MapPin } from "lucide-react";

export const revalidate = 0;

export default async function Home() {
  const settings = await getSiteSettings();
  const products = await getProducts({ limit: 8 });

  const iconMap: any = {
    ShieldCheck: <ShieldCheck className="text-[#0B3D91]" size={40} />,
    Settings: <Settings className="text-[#0B3D91]" size={40} />,
    Users: <Users className="text-[#0B3D91]" size={40} />,
    Globe: <Globe className="text-[#0B3D91]" size={40} />,
    Award: <Award className="text-[#0B3D91]" size={40} />,
    Factory: <Warehouse className="text-[#0B3D91]" size={40} />,
  };

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* About Section */}
        <Section 
          title="About HK Metal House" 
          subtitle="Our Journey" 
          id="about"
          className="bg-white"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative h-[350px] sm:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <Image 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
                alt="About HK Metal House" 
                fill 
                className="object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-[#0B3D91] text-white p-6 sm:p-10 rounded-tl-3xl shadow-xl">
                <p className="text-4xl sm:text-5xl font-bold mb-1 sm:mb-2">25+</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-[#D4AF37]">Years of Trust</p>
              </div>
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0B3D91] mb-6">Leading Industrial Metal Trader & Supplier</h3>
              <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {companyInfo.description}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-10 max-w-md mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="bg-[#D4AF37]/10 p-3 rounded-xl"><Award className="text-[#0B3D91]" size={24} /></div>
                  <span className="font-bold text-gray-800 text-sm sm:text-base">Quality Assured</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="bg-[#D4AF37]/10 p-3 rounded-xl"><Warehouse className="text-[#0B3D91]" size={24} /></div>
                  <span className="font-bold text-gray-800 text-sm sm:text-base">Ready Stock</span>
                </div>
              </div>
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 bg-[#0B3D91] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#D4AF37] hover:text-[#0B3D91] transition-all duration-300 shadow-lg group"
              >
                Learn More About Us <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </Section>

        {/* Products Section */}
        <Section 
          title="Our Products" 
          subtitle="Precision Components" 
          bg="gray"
          id="products"
        >
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id}
                  title={product.name}
                  description={product.short_description}
                  image={product.primary_image || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400&h=300"}
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
            <div className="text-center py-10">
              <p className="text-gray-500">Check out our products page for our full catalog.</p>
            </div>
          )}
          <div className="text-center mt-12 md:mt-16">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 border-2 border-[#0B3D91] text-[#0B3D91] px-10 py-4 rounded-xl font-bold hover:bg-[#0B3D91] hover:text-white transition-all duration-300 group shadow-md"
            >
              View All Products <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Section>

        {/* Why Choose Us */}
        <Section title="Why Partner With Us?" subtitle="Our Value Proposition" bg="white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="bg-gray-50 p-8 sm:p-10 rounded-2xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group text-center sm:text-left">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center sm:justify-start">
                  {iconMap[item.icon]}
                </div>
                <h3 className="text-xl font-bold text-[#0B3D91] mb-4 group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Quality Section */}
        <Section title="Uncompromising Quality" subtitle="Our Standards" bg="white" id="quality">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                At HK Metal House, quality is not just a standard but a core philosophy. We employ rigorous testing protocols to ensure every component meets international benchmarks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {qualityStandards.map((std, index) => (
                  <div key={index} className="flex items-center gap-4 bg-gray-50 p-5 sm:p-6 rounded-2xl border border-gray-100 hover:border-[#D4AF37]/30 transition-colors group">
                    <div className="bg-[#0B3D91] text-white p-2 rounded-xl group-hover:bg-[#D4AF37] transition-colors">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="font-bold text-gray-800 text-base sm:text-lg">{std.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Quality Control" fill className="object-cover" />
              <div className="absolute inset-0 bg-[#0B3D91]/10" />
            </div>
          </div>
        </Section>

        {/* Contact Section */}
        <Section title="Get in Touch" subtitle="Contact Us" bg="gray" id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
                <ContactForm />
              </div>
            </div>
            <div className="space-y-8 lg:space-y-10 order-1 lg:order-2">
              <div className="bg-[#0B3D91] text-white p-8 sm:p-10 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                <h3 className="text-xl sm:text-2xl font-bold mb-8 relative z-10">Contact Information</h3>
                <div className="space-y-8 relative z-10">
                  <div className="flex gap-4 items-center sm:items-start group">
                    <div className="bg-white/10 p-3 rounded-xl group-hover:bg-[#D4AF37] group-hover:text-[#0B3D91] transition-all">
                      <Phone className="shrink-0" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-300 uppercase tracking-widest mb-1">Call Us</p>
                      <p className="font-bold text-base sm:text-lg">{settings.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center sm:items-start group">
                    <div className="bg-white/10 p-3 rounded-xl group-hover:bg-[#D4AF37] group-hover:text-[#0B3D91] transition-all">
                      <Mail className="shrink-0" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-300 uppercase tracking-widest mb-1">Email Us</p>
                      <p className="font-bold text-base sm:text-lg break-all">{settings.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center sm:items-start group">
                    <div className="bg-white/10 p-3 rounded-xl group-hover:bg-[#D4AF37] group-hover:text-[#0B3D91] transition-all">
                      <MapPin className="shrink-0" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-300 uppercase tracking-widest mb-1">Our Office</p>
                      <p className="font-bold text-sm sm:text-base leading-relaxed">{settings.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <GoogleMap />
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
