import { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import { qualityStandards } from "@/data/quality";
import { CheckCircle2, ShieldCheck, Microscope, Award, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Quality Inspection - HK Metal House | Trusted Industrial Metal Supplier",
  description: "Our rigorous quality inspection process ensures that every sourced product meets international standards.",
};

export default function QualityPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader title="Quality Inspection" subtitle="Supply Capabilities" />
        
        <Section>
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Assuring Excellence through Rigorous Inspection</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At HK Metal House, quality is the cornerstone of our supply operations. Even though we source products from trusted manufacturers, we conduct our own rigorous multi-stage inspection process to ensure that every component delivered to you is of the highest possible quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {[
              { title: "Supplier Audit", icon: <ShieldCheck size={40} />, desc: "Only products from certified and audited manufacturers are sourced." },
              { title: "Incoming Check", icon: <Settings size={40} />, desc: "Thorough inspection of all materials entering our warehouse." },
              { title: "Precision Gauging", icon: <Microscope size={40} />, desc: "Advanced measurement tools to verify dimensional accuracy." },
              { title: "Pre-Shipment Inspection", icon: <CheckCircle2 size={40} />, desc: "100% check of all orders before they are dispatched." }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-10 rounded-2xl text-center border-t-4 border-primary shadow-sm">
                <div className="text-primary mb-6 flex justify-center">{item.icon}</div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800" 
                alt="Quality Inspection Center" 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-8">Our Quality Assurance Process</h3>
              <div className="space-y-8">
                {qualityStandards.map((item, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
