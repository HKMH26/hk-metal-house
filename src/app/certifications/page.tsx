import { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import { certifications } from "@/data/certifications";

export const metadata: Metadata = {
  title: "Certifications - HK Metal House | Trusted Industrial Metal Supplier",
  description: "HK Metal House is ISO certified and compliant with international health and safety standards.",
};

export default function CertificationsPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader title="Certifications" subtitle="Global Standards & Compliance" />
        
        <Section>
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-3xl font-bold mb-6">Recognized for Excellence</h2>
            <p className="text-gray-600 text-lg">
              Our commitment to quality and safety is reflected in the international certifications we hold. These recognitions validate our processes and provide our clients with peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
                <div className="bg-gray-50 p-12 flex justify-center items-center">
                  <div className="relative w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Image 
                      src="https://images.unsplash.com/photo-1635350736475-c8cef4b21906?auto=format&fit=crop&q=80&w=150&h=150" 
                      alt={cert.title} 
                      width={120} 
                      height={120} 
                      className="grayscale group-hover:grayscale-0 transition-all"
                    />
                  </div>
                </div>
                <div className="p-8 text-center">
                  <h4 className="text-2xl font-bold text-primary mb-3">{cert.title}</h4>
                  <p className="text-gray-600 mb-6">{cert.description}</p>
                  <div className="h-1.5 w-16 bg-accent mx-auto"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 p-12 bg-gray-50 rounded-3xl border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">Compliance & Supply Standards</h3>
                <p className="text-gray-600 mb-4">
                  We ensure that all our sourcing partners are fully compliant with environmental regulations and maintain sustainable manufacturing processes. Our supply chain is designed to minimize waste and optimize logistics efficiency.
                </p>
                <p className="text-gray-600">
                  Beyond certifications, we conduct regular audits of our suppliers' facilities to ensure that they meet the high standards expected by our global clientele.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm text-center font-bold text-primary">RoHS Compliant</div>
                <div className="bg-white p-6 rounded-xl shadow-sm text-center font-bold text-primary">REACH Registered</div>
                <div className="bg-white p-6 rounded-xl shadow-sm text-center font-bold text-primary">Conflict Free Sourcing</div>
                <div className="bg-white p-6 rounded-xl shadow-sm text-center font-bold text-primary">Green Supply Chain</div>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
