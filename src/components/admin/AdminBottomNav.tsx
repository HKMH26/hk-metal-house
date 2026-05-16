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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] pb-[env(safe-area-inset-bottom)] px-2 mb-2 bg-gradient-to-t from-[#F6F9FC] to-transparent pt-6 pointer-events-none">
      <div className="bg-gradient-to-r from-[#0B3D91] via-[#0A3A7A] to-[#082D5F] backdrop-blur-xl border border-white/10 h-[72px] rounded-[24px] shadow-[0_-4px_24px_rgba(11,61,145,0.15)] flex justify-around items-center overflow-hidden pointer-events-auto mx-2 mb-2">
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
                isActive ? "text-[#D4AF37]" : "text-white/60"
              )}>
                {item.name}
              </span>
              
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-[#D4AF37] rounded-b-full shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
