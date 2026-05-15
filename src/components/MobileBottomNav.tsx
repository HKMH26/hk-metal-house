"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, LayoutGrid, MessageSquare, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [phone, setPhone] = useState("");
  const supabase = createClient();

  // Do not render on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "business_info")
        .single();
      
      if (data?.value?.phone) {
        setPhone(data.value.phone);
      }
    };
    fetchSettings();
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home, color: "text-[#0F4C9A]", activeBg: "bg-[#0F4C9A]/10" },
    { name: "Profile", href: "/about", icon: User, color: "text-[#0E9F6E]", activeBg: "bg-[#0E9F6E]/10" },
    { name: "Our Range", href: "/products", icon: LayoutGrid, color: "text-[#D4AF37]", activeBg: "bg-[#D4AF37]/10" },
    { name: "Contact Us", href: "/contact", icon: MessageSquare, color: "text-[#0F4C9A]", activeBg: "bg-[#0F4C9A]/10" },
    { name: "Call Us", href: `tel:${phone || "+918320662353"}`, icon: Phone, color: "text-[#0E9F6E]", activeBg: "bg-[#0E9F6E]/10", isExternal: true },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-[100] pb-safe rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.12)] overflow-hidden">
      <div className="flex justify-around items-center h-20 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          const content = (
            <div className="flex flex-col items-center justify-center gap-1 transition-all duration-300">
              <div className={cn(
                "p-2.5 rounded-full transition-all duration-500",
                isActive ? cn(item.activeBg, "scale-110 shadow-inner") : "bg-transparent"
              )}>
                <Icon size={22} className={cn(
                  "transition-colors duration-300",
                  isActive ? item.color : "text-gray-400"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-tight transition-all duration-300",
                isActive ? cn(item.color, "scale-105") : "text-gray-500"
              )}>
                {item.name}
              </span>
            </div>
          );

          if (item.isExternal) {
            return (
              <a
                key={item.name}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center h-full active:scale-90 transition-transform"
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center h-full active:scale-90 transition-transform"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
