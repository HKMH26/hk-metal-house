import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import GoogleMap from "@/components/GoogleMap";
import { companyInfo } from "@/data/company";
import { createClient } from "@/lib/supabase/server";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - HK Metal House | Trusted Industrial Metal Supplier",
  description: "Get in touch with HK Metal House for inquiries about our metal manufacturing products and services.",
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: settingsData } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "business_info")
    .single();

  const settings = settingsData?.value || {};

  return (
    <>
      <Header />
      <main>
        <PageHeader title="Contact Us" subtitle="Let's Start a Conversation" />
        
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-primary mb-8">{settings.companyName || companyInfo.name}</h2>
              <p className="text-gray-600 mb-12 text-lg">
                Have a question about our products or need a custom sourcing solution? Our team of experts is ready to assist you.
              </p>
              
              <div className="space-y-10">
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-white p-4 rounded-xl shadow-lg">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Our Location</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {settings.address || companyInfo.contact.address}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-white p-4 rounded-xl shadow-lg">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Phone Numbers</h4>
                    <p className="text-gray-600">{settings.phone || companyInfo.contact.phone}</p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-white p-4 rounded-xl shadow-lg">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Email Addresses</h4>
                    <p className="text-gray-600">{settings.email || companyInfo.contact.email}</p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-white p-4 rounded-xl shadow-lg">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Business Hours</h4>
                    <p className="text-gray-600">{settings.workingHours || companyInfo.contact.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="mb-12">
                <GoogleMap />
              </div>
              <ContactForm />
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
