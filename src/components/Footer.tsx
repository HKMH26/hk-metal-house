import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Linkedin, Twitter } from "lucide-react";
import { navigationLinks } from "@/data/navigation";
import { companyInfo } from "@/data/company";
import { productCategories } from "@/data/products";

export default function Footer() {
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
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">HK Metal House</h3>
          <p className="text-gray-300 mb-6 leading-relaxed">
            {companyInfo.description}
          </p>
          <div className="flex gap-4">
            <a href={companyInfo.socials.facebook} className="bg-white/10 p-2 rounded-full hover:bg-accent hover:text-primary transition-all">
              <Facebook size={20} />
            </a>
            <a href={companyInfo.socials.linkedin} className="bg-white/10 p-2 rounded-full hover:bg-accent hover:text-primary transition-all">
              <Linkedin size={20} />
            </a>
            <a href={companyInfo.socials.twitter} className="bg-white/10 p-2 rounded-full hover:bg-accent hover:text-primary transition-all">
              <Twitter size={20} />
            </a>
          </div>
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
            {productCategories.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link href={`/products/${cat.slug}`} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-accent">›</span> {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xl font-bold mb-6 border-b-2 border-accent w-fit pb-1">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 text-gray-300">
              <MapPin className="text-accent shrink-0" size={20} />
              <span>{companyInfo.contact.address}</span>
            </li>
            <li className="flex gap-3 text-gray-300">
              <Phone className="text-accent shrink-0" size={20} />
              <a href={`tel:${companyInfo.contact.phone}`} className="hover:text-white transition-colors">{companyInfo.contact.phone}</a>
            </li>
            <li className="flex gap-3 text-gray-300">
              <Mail className="text-accent shrink-0" size={20} />
              <a href={`mailto:${companyInfo.contact.email}`} className="hover:text-white transition-colors">{companyInfo.contact.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} {companyInfo.name}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
