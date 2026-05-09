import { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import { companyInfo } from "@/data/company";
import { Target, Eye, ShieldCheck, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - HK Metal House | Trusted Industrial Metal Supplier",
  description: "Learn about HK Metal House's journey as a leading industrial metal supplier and strategic sourcing partner.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader title="About Us" subtitle="Our Journey & Vision" />
        
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Your Strategic Partner in Industrial Metal Sourcing</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Founded with a vision to streamline industrial sourcing, HK Metal House has grown into a leading trader and supplier of metal products. We bridge the gap between world-class manufacturers and industries that require precision-engineered components with guaranteed quality.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Our commitment to quality inspection, competitive pricing, and timely delivery has earned us the trust of clients across various sectors. We maintain a ready stock of essential components to ensure that your operations never face a delay.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-primary">
                  <Target className="text-primary mb-4" size={32} />
                  <h4 className="font-bold text-xl mb-2">Our Mission</h4>
                  <p className="text-gray-600 text-sm">To provide a reliable supply chain of high-quality metal solutions through strategic sourcing and rigorous inspection.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-secondary">
                  <Eye className="text-secondary mb-4" size={32} />
                  <h4 className="font-bold text-xl mb-2">Our Vision</h4>
                  <p className="text-gray-600 text-sm">To be the most trusted global partner for industrial metal trading and inventory management.</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
                alt="Our Warehouse" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </Section>

        <Section bg="gray" title="Our Core Values" subtitle="What Drives Us">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Quality First", desc: "We never compromise on the quality of our materials and finished products.", icon: <ShieldCheck size={40} /> },
              { title: "Customer Centric", desc: "Your needs are our priority. We tailor our solutions to your specific requirements.", icon: <Award size={40} /> },
              { title: "Innovation", desc: "Continuously investing in R&D to stay ahead of industry trends.", icon: <Target size={40} /> },
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-10 rounded-2xl shadow-sm text-center">
                <div className="text-primary mb-6 flex justify-center">{value.icon}</div>
                <h4 className="text-2xl font-bold mb-4">{value.title}</h4>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
