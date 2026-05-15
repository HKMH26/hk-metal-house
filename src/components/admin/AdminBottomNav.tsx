"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  Star, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] pb-safe px-4 mb-2">
      <div className="bg-gradient-to-r from-[#0B3D91] to-[#0F4C9A] backdrop-blur-lg border border-white/10 h-16 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex justify-around items-center overflow-hidden">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center h-full relative transition-all duration-300 active:scale-90"
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-500",
                isActive ? "bg-[#D4AF37] text-[#0B3D91] shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "text-gray-300"
              )}>
                <Icon size={20} className={cn(
                  "transition-transform duration-300",
                  isActive && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-tight mt-0.5 transition-colors duration-300",
                isActive ? "text-[#D4AF37]" : "text-gray-400"
              )}>
                {item.name}
              </span>
              
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#D4AF37] rounded-b-full shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
