"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  Star,
  KeyRound,
  Menu,
  X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Change Password", href: "/admin/change-password", icon: KeyRound },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const getPageTitle = () => {
    if (pathname.includes('/products/new')) return 'Add Product';
    if (pathname.includes('/products/') && pathname !== '/admin/products') return 'Edit Product';
    if (pathname.includes('/change-password')) return 'Change Password';
    const match = navItems.find(item => pathname.startsWith(item.href));
    return match ? match.name : 'Dashboard';
  };

  return (
    <>
      {/* Mobile Toggle & Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-white border-b border-[#E2E8F0] px-4 h-[72px] flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -ml-2 text-[#0A3A7A] hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 font-bold text-[#0F172A] text-[18px] tracking-tight whitespace-nowrap">
          {getPageTitle()}
        </div>
        
        {/* Placeholder to balance flex space */}
        <div className="w-10"></div>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "w-[85vw] max-w-[340px] lg:max-w-none lg:w-80 bg-gradient-to-b from-[#0B3D91] via-[#0A3A7A] to-[#082D5F] text-white flex flex-col h-[100dvh] fixed left-0 top-0 z-[1000] border-r border-white/5 transition-all duration-500 ease-in-out shadow-2xl overflow-hidden",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between px-6 py-8 border-b border-white/10"> 
          <div className="flex items-center gap-4">
            <Image 
              src="/images/hk-metal-house-logo.png" 
              alt="HK Metal House" 
              width={64} 
              height={64} 
              priority 
              className="object-contain flex-shrink-0 brightness-110 shadow-lg rounded-xl" 
            /> 
          
            <div className="min-w-0"> 
              <h1 className="text-xl font-black text-white leading-tight tracking-tight"> 
                HK Metal House 
              </h1> 
              <p className="mt-1 text-[10px] font-black tracking-[0.3em] text-blue-200/80 uppercase"> 
                ADMIN PANEL 
              </p> 
            </div> 
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-4 px-2">Main Menu</p>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-white/15 text-white font-bold shadow-lg border border-white/10" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-4 z-10">
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    isActive ? "bg-[#D4AF37] text-[#0B3D91]" : "bg-white/5 text-white group-hover:bg-white/10"
                  )}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-sm tracking-wide">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-[#D4AF37] z-10" />}
                
                {/* Glassmorphism Highlight */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10 bg-black/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-4 text-white/60 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all group border border-transparent hover:border-red-500/20"
          >
            <div className="p-2 bg-white/5 rounded-xl group-hover:bg-red-500/20 transition-colors">
              <LogOut size={20} className="group-hover:text-red-400" />
            </div>
            <span className="text-sm font-bold tracking-wide">Logout Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
