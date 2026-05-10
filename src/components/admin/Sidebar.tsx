"use client";

import Link from "next/link";
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
  KeyRound
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
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-50 bg-gradient-to-b from-[#0A3A7A] to-[#082D5F] text-white flex flex-col min-h-screen fixed left-0 top-0 z-40 border-r border-white/5">
      <div className="flex items-center gap-4 px-6 py-6 border-b border-white/10"> 
        <Image 
          src="/images/hk-metal-house-logo.png" 
          alt="HK Metal House" 
          width={82} 
          height={82} 
          priority 
          className="object-contain flex-shrink-0" 
        /> 
      
        <div className="min-w-0"> 
          <h1 className="text-xl font-bold text-white leading-tight"> 
            HK Metal House 
          </h1> 
          <p className="mt-1 text-sm font-semibold tracking-[0.25em] text-blue-100/90"> 
            ADMIN PANEL 
          </p> 
        </div> 
      </div>
      
      <nav className="flex-1 p-4 space-y-1.5 mt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-white/10 text-white font-bold shadow-sm" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={cn("transition-colors", isActive ? "text-[#F4B400]" : "group-hover:text-[#F4B400]")} />
                <span className="text-sm">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-[#F4B400]" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 text-white/50 hover:text-white hover:bg-red-500/10 rounded-xl transition-all group"
        >
          <LogOut size={18} className="group-hover:text-red-400" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
