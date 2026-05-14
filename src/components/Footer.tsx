import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { navigationLinks } from "@/data/navigation";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { createClient } from "@/lib/supabase/server";
import SocialLinks from "./SocialLinks";

export default async function Footer() {
  const settings = await getSiteSettings();
  const supabase = await createClient();
  
  // Use products table for quick links
  const { data: products } = await supabase
    .from("products")
    .select("name, slug")
    .eq("active", true)
    .limit(5);

  return (
    <footer className="bg-[#0B3D91] text-white pt-12 md:pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
        {/* Company Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="relative mb-6">
            <Image 
              src="/images/hk-metal-house-logo.png" 
              alt="HK Metal House" 
              width={400}
              height={150}
              className="h-[70px] md:h-[90px] w-auto object-contain"
            />
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-white uppercase tracking-wider">{settings.companyName}</h3>
          <p className="text-gray-300 mb-8 leading-relaxed text-sm md:text-base">
            Leading trader, stockist, and supplier of high-quality metal components and industrial products. We ensure that every product meets rigorous quality standards for global industrial needs.
          </p>
          <SocialLinks 
            settings={settings} 
            className="gap-4" 
            iconClassName="bg-white/10 p-2.5 rounded-xl hover:bg-[#D4AF37] hover:text-[#0B3D91] transition-all duration-300" 
          />
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-bold mb-6 border-b-2 border-[#D4AF37] w-fit mx-auto md:mx-0 pb-1">Quick Links</h4>
          <ul className="space-y-3">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-gray-300 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group">
                  <span className="text-[#D4AF37] group-hover:translate-x-1 transition-transform">›</span> {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-bold mb-6 border-b-2 border-[#D4AF37] w-fit mx-auto md:mx-0 pb-1">Our Products</h4>
          <ul className="space-y-3">
            {products && products.length > 0 ? (
              products.map((product: any) => (
                <li key={product.slug}>
                  <Link href={`/products/${product.slug}`} className="text-gray-300 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group">
                    <span className="text-[#D4AF37] group-hover:translate-x-1 transition-transform">›</span> {product.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic">No products listed</li>
            )}
          </ul>
        </div>

        {/* Contact Us */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-bold mb-6 border-b-2 border-[#D4AF37] w-fit mx-auto md:mx-0 pb-1">Contact Us</h4>
          <ul className="space-y-5">
            <li className="flex flex-col md:flex-row gap-3 items-center md:items-start group">
              <div className="bg-white/10 p-2.5 rounded-xl text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0B3D91] transition-all shrink-0">
                <MapPin size={20} />
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors text-sm leading-relaxed">{settings.address}</span>
            </li>
            <li className="flex flex-col md:flex-row gap-3 items-center md:items-start group">
              <div className="bg-white/10 p-2.5 rounded-xl text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0B3D91] transition-all shrink-0">
                <Phone size={20} />
              </div>
              <a href={`tel:${settings.phone}`} className="text-gray-300 group-hover:text-white transition-colors text-sm">{settings.phone}</a>
            </li>
            <li className="flex flex-col md:flex-row gap-3 items-center md:items-start group">
              <div className="bg-white/10 p-2.5 rounded-xl text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0B3D91] transition-all shrink-0">
                <Mail size={20} />
              </div>
              <a href={`mailto:${settings.email}`} className="text-gray-300 group-hover:text-white transition-colors text-sm">{settings.email}</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 text-center text-gray-400 text-xs md:text-sm">
        <p>© {new Date().getFullYear()} {settings.companyName}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
