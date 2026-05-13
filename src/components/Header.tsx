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

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
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
          <Link href="/" className="flex items-center gap-4">
            <Image 
              src="/images/hk-metal-house-logo.png" 
              alt="HK Metal House" 
              width={450} 
              height={230} 
              className="h-[65px] md:h-[85px] w-auto object-contain" 
              priority 
            />
            <span className="text-xl md:text-2xl font-bold text-primary tracking-tight hidden sm:block">
              {companyName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-8">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary border-b-2 border-primary" : "text-secondary"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-secondary hover:text-primary transition-colors"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden bg-white border-t mt-4 py-4 px-4 shadow-lg animate-in slide-in-from-top duration-300">
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
