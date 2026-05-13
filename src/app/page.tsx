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
    ShieldCheck: <ShieldCheck className="text-primary" size={40} />,
    Settings: <Settings className="text-primary" size={40} />,
    Users: <Users className="text-primary" size={40} />,
    Globe: <Globe className="text-primary" size={40} />,
    Award: <Award className="text-primary" size={40} />,
    Factory: <Warehouse className="text-primary" size={40} />,
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
                alt="About HK Metal House" 
                fill 
                className="object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-primary text-white p-10 rounded-tl-3xl">
                <p className="text-5xl font-bold mb-2">25+</p>
                <p className="text-sm uppercase tracking-widest font-bold">Years of Trust</p>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary mb-6">Leading Industrial Metal Trader & Supplier</h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {companyInfo.description}
              </p>
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="flex items-center gap-4">
                  <div className="bg-accent p-3 rounded-lg"><Award className="text-primary" /></div>
                  <span className="font-bold text-gray-800">Quality Assured</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-accent p-3 rounded-lg"><Warehouse className="text-primary" /></div>
                  <span className="font-bold text-gray-800">Ready Stock</span>
                </div>
              </div>
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-md font-bold hover:bg-secondary transition-all"
              >
                Learn More About Us <ArrowRight size={20} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
          <div className="text-center mt-16">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 border-2 border-primary text-primary px-10 py-4 rounded-md font-bold hover:bg-primary hover:text-white transition-all"
            >
              View All Products <ArrowRight size={20} />
            </Link>
          </div>
        </Section>

        {/* Rest of the sections remain the same... */}
        {/* Why Choose Us */}
        <Section title="Why Partner With Us?" subtitle="Our Value Proposition" bg="white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="bg-gray-50 p-10 rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {iconMap[item.icon]}
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Quality Section */}
        <Section title="Uncompromising Quality" subtitle="Our Standards" bg="white" id="quality">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <p className="text-lg text-gray-600 leading-relaxed">
                At HK Metal House, quality is not just a standard but a core philosophy. We employ rigorous testing protocols to ensure every component meets international benchmarks.
              </p>
              <div className="space-y-4">
                {qualityStandards.map((std, index) => (
                  <div key={index} className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="bg-primary text-white p-2 rounded-full">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">{std.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Quality Control" fill className="object-cover" />
            </div>
          </div>
        </Section>

        {/* Contact Section */}
        <Section title="Get in Touch" subtitle="Contact Us" bg="gray" id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <div className="space-y-10">
              <div className="bg-primary text-white p-10 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <Phone className="text-accent shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300 mb-1">Call Us</p>
                      <p className="font-bold text-lg">{settings.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Mail className="text-accent shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300 mb-1">Email Us</p>
                      <p className="font-bold text-lg">{settings.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin className="text-accent shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300 mb-1">Our Office</p>
                      <p className="font-bold text-lg">{settings.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-64 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
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
