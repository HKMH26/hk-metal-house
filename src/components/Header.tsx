"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail } from "lucide-react";
import { navigationLinks } from "@/data/navigation";
import { companyInfo } from "@/data/company";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import SocialLinks from "./SocialLinks";
import GlobalSearch from "./GlobalSearch";
import { Search } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Fetch settings directly from Supabase for real-time updates
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "business_info")
        .single();
      
      if (data) {
        setSettings(data.value);
      }
    };

    fetchSettings();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const contactPhone = settings?.phone || companyInfo.contact.phone;
  const contactEmail = settings?.email || companyInfo.contact.email;
  const workingHours = settings?.workingHours || companyInfo.contact.workingHours;
  const companyName = settings?.companyName || "HK METAL HOUSE";

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex gap-6">
            <a href={`tel:${contactPhone}`} className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone size={14} /> {contactPhone}
            </a>
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail size={14} /> {contactEmail}
            </a>
          </div>
          <div className="flex items-center gap-6">
            <span>{workingHours}</span>
            {settings && (
              <SocialLinks 
                settings={settings} 
                iconClassName="hover:text-accent" 
                className="border-l border-white/20 pl-6 hidden lg:flex" 
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={cn(
        "transition-all duration-300",
        scrolled ? "bg-white shadow-md py-1" : "bg-white/90 backdrop-blur-md py-2"
      )}>
        <div className="container mx-auto px-4 flex justify-between items-center min-h-[80px] md:min-h-[110px]">
          <Link href="/" className="flex items-center gap-3 md:gap-4">
            <Image 
              src="/images/hk-metal-house-logo.png" 
              alt="HK Metal House" 
              width={450} 
              height={230} 
              className="h-[50px] sm:h-[65px] md:h-[85px] w-auto object-contain transition-all" 
              priority 
            />
            <span className="text-lg md:text-2xl font-bold text-[#0B3D91] tracking-tight hidden sm:block">
              {companyName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-8">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "font-medium transition-colors hover:text-[#0B3D91]",
                      pathname === link.href ? "text-[#0B3D91] border-b-2 border-[#0B3D91]" : "text-secondary"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="w-px h-6 bg-gray-200" />
            <GlobalSearch className="w-72" />
          </div>

          {/* Mobile Toggle & Search */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-4">
            <button
              className="text-secondary hover:text-[#0B3D91] transition-colors p-2"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <Search size={22} />
            </button>
            <button
              className="text-secondary hover:text-[#0B3D91] transition-colors p-2"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] bg-white animate-in fade-in zoom-in duration-200">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-primary">Search Products</h3>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-primary transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <GlobalSearch 
                isMobile 
                onClose={() => setIsSearchOpen(false)} 
                className="w-full"
                placeholder="Search products, services, or pages..." 
              />
              <div className="mt-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {["Butterfly Valve", "TC Clamp", "Ball Valve", "Dairy Fitting", "Sight Glass"].map((tag) => (
                    <Link
                      key={tag}
                      href={`/products?search=${encodeURIComponent(tag)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t mt-4 py-4 px-4 shadow-lg animate-in slide-in-from-top duration-300">
            <ul className="flex flex-col gap-4">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block py-2 font-medium",
                      pathname === link.href ? "text-primary" : "text-secondary"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
