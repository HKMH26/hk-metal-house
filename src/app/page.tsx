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
import { productCategories } from "@/data/products";
import { infrastructureItems } from "@/data/infrastructure";
import { qualityStandards } from "@/data/quality";
import { certifications } from "@/data/certifications";
import { ShieldCheck, Settings, Users, Globe, ArrowRight, Award, Warehouse, Microscope, Phone, Mail } from "lucide-react";

export default function Home() {
  const iconMap: any = {
    ShieldCheck: <ShieldCheck className="text-primary" size={40} />,
    Settings: <Settings className="text-primary" size={40} />,
    Users: <Users className="text-primary" size={40} />,
    Globe: <Globe className="text-primary" size={40} />,
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

        {/* Product Categories */}
        <Section 
          title="Our Product Range" 
          subtitle="Precision Components" 
          bg="gray"
          id="products"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productCategories.map((cat, index) => (
              <ProductCard 
                key={cat.id}
                title={cat.title}
                description={cat.description}
                image={`https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400&h=300`} // Placeholder
                slug={cat.slug}
                index={index}
              />
            ))}
          </div>
          <div className="text-center mt-16">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 border-2 border-primary text-primary px-10 py-4 rounded-md font-bold hover:bg-primary hover:text-white transition-all"
            >
              View All Products <ArrowRight size={20} />
            </Link>
          </div>
        </Section>

        {/* Infrastructure Section */}
        <Section 
          title="Warehouse & Supply Network" 
          subtitle="Ready Stock Availability"
          id="infrastructure"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {infrastructureItems.map((item, index) => (
              <div key={index} className="group relative h-80 rounded-xl overflow-hidden shadow-lg">
                <Image 
                  src={`https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400&h=500`} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-6">
                  <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Quality Section */}
        <Section 
          title="Quality Inspection" 
          subtitle="Supply Capabilities" 
          bg="dark"
          id="quality"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-8">Rigorous Inspection of Sourced Products</h3>
              <div className="space-y-6">
                {qualityStandards.map((item, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="bg-white/10 p-4 rounded-xl border border-white/10 shrink-0">
                      <Microscope className="text-accent" size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 text-accent">{item.title}</h4>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[450px] rounded-2xl overflow-hidden border-8 border-white/5">
              <Image 
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800" 
                alt="Quality Inspection" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </Section>

        {/* Certifications */}
        <Section 
          title="Our Certifications" 
          subtitle="Trusted Worldwide"
          id="certifications"
        >
          <div className="flex flex-wrap justify-center gap-12">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center max-w-[250px] group">
                <div className="bg-gray-50 p-10 rounded-2xl mb-6 group-hover:bg-accent transition-colors duration-300">
                  <Image 
                    src="https://images.unsplash.com/photo-1635350736475-c8cef4b21906?auto=format&fit=crop&q=80&w=150&h=150" 
                    alt={cert.title} 
                    width={150} 
                    height={150} 
                    className="mx-auto grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                <h4 className="text-xl font-bold text-primary mb-2">{cert.title}</h4>
                <p className="text-gray-600 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Why Choose Us */}
        <Section 
          title="Why Choose HK Metal House?" 
          subtitle="Our Strengths" 
          bg="gray"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="bg-white p-10 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300 border-b-4 border-primary">
                <div className="mb-6">{iconMap[item.icon] || <Award className="text-primary" size={40} />}</div>
                <h4 className="text-xl font-bold mb-4 text-primary">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Contact Section */}
        <Section 
          title="Get in Touch" 
          subtitle="Contact Us" 
          id="contact"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <h3 className="text-2xl font-bold text-primary mb-6">HK Metal House</h3>
              <div className="bg-gray-50 p-8 rounded-xl space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg"><Globe className="text-primary" size={20} /></div>
                  <div>
                    <h5 className="font-bold text-gray-800">Our Office</h5>
                    <p className="text-gray-600">{companyInfo.contact.address}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg"><Phone className="text-primary" size={20} /></div>
                  <div>
                    <h5 className="font-bold text-gray-800">Call Us</h5>
                    <p className="text-gray-600">{companyInfo.contact.phone}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg"><Mail className="text-primary" size={20} /></div>
                  <div>
                    <h5 className="font-bold text-gray-800">Email Us</h5>
                    <p className="text-gray-600">{companyInfo.contact.email}</p>
                  </div>
                </div>
              </div>
              <GoogleMap />
            </div>
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
