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
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Company Info */}
        <div>
          <div className="relative mb-6">
            <Image 
              src="/images/hk-metal-house-logo.png" 
              alt="HK Metal House" 
              width={400}
              height={150}
              className="h-[80px] md:h-[100px] w-auto object-contain"
            />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{settings.companyName}</h3>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Leading trader, stockist, and supplier of high-quality metal components and industrial products. Sourced from a network of trusted manufacturers, we ensure that every product meets rigorous quality standards.
          </p>
          <SocialLinks 
            settings={settings} 
            className="gap-5" 
            iconClassName="bg-white/10 p-2.5 rounded-full hover:bg-accent hover:text-primary" 
          />
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-bold mb-6 border-b-2 border-accent w-fit pb-1">Quick Links</h4>
          <ul className="space-y-3">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-accent">›</span> {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-xl font-bold mb-6 border-b-2 border-accent w-fit pb-1">Our Products</h4>
          <ul className="space-y-3">
            {products && products.length > 0 ? (
              products.map((product: any) => (
                <li key={product.slug}>
                  <Link href={`/products/${product.slug}`} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-accent">›</span> {product.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic">No products listed</li>
            )}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-xl font-bold mb-6 border-b-2 border-accent w-fit pb-1">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex gap-4 items-start group">
              <div className="bg-white/10 p-2 rounded-lg text-accent group-hover:bg-accent group-hover:text-primary transition-all">
                <MapPin size={18} />
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors">{settings.address}</span>
            </li>
            <li className="flex gap-4 items-center group">
              <div className="bg-white/10 p-2 rounded-lg text-accent group-hover:bg-accent group-hover:text-primary transition-all">
                <Phone size={18} />
              </div>
              <a href={`tel:${settings.phone}`} className="text-gray-300 group-hover:text-white transition-colors">{settings.phone}</a>
            </li>
            <li className="flex gap-4 items-center group">
              <div className="bg-white/10 p-2 rounded-lg text-accent group-hover:bg-accent group-hover:text-primary transition-all">
                <Mail size={18} />
              </div>
              <a href={`mailto:${settings.email}`} className="text-gray-300 group-hover:text-white transition-colors">{settings.email}</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} {settings.companyName}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
