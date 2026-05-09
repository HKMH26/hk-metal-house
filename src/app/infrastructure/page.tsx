import { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import { infrastructureItems } from "@/data/infrastructure";

export const metadata: Metadata = {
  title: "Warehouse & Supply Network - HK Metal House | Trusted Industrial Metal Supplier",
  description: "Take a look at our robust inventory management and global supply network.",
};

export default function InfrastructurePage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader title="Warehouse & Supply Network" subtitle="Ready Stock Availability" />
        
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Robust Inventory & Supply Chain</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Our warehouse and supply network is the backbone of our trading operations. With over 50,000 sq. ft. of storage space and a streamlined logistics system, we ensure that we always have the products you need in stock and ready for immediate delivery.
              </p>
              <ul className="space-y-4">
                {[
                  "Extensive Ready Stock Inventory",
                  "Strategic Global Sourcing Network",
                  "Dedicated Quality Inspection Zone",
                  "Advanced Inventory Management System",
                  "Efficient Worldwide Logistics Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-800 font-medium">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
                alt="Warehouse View" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {infrastructureItems.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 bg-gray-50 p-8 rounded-2xl group hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="relative w-full md:w-48 h-48 shrink-0 rounded-xl overflow-hidden">
                  <Image 
                    src={`https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=300`} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-primary mb-3">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
