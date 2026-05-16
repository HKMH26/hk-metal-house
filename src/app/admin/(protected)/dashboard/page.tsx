import { createClient } from "@/lib/supabase/server";
import { Package, MessageSquare, Star, TrendingUp, ArrowRight, Plus, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch summary data
  const [
    { count: totalProducts },
    { count: featuredProducts },
    { count: totalInquiries },
    { count: approvedReviews },
    { count: pendingReviews },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("featured", true),
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase.from("product_reviews").select("*", { count: "exact", head: true }).eq("approved", true),
    supabase.from("product_reviews").select("*", { count: "exact", head: true }).eq("approved", false),
  ]);

  // Fetch recent products
  const { data: recentProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { 
      name: "Total Products", 
      value: totalProducts || 0, 
      icon: Package, 
      color: "from-blue-600 to-blue-400",
      shadow: "shadow-blue-500/20"
    },
    { 
      name: "Total Inquiries", 
      value: totalInquiries || 0, 
      icon: MessageSquare, 
      color: "from-green-600 to-green-400",
      shadow: "shadow-green-500/20"
    },
    { 
      name: "Approved Reviews", 
      value: approvedReviews || 0, 
      icon: Star, 
      color: "from-yellow-600 to-yellow-400",
      shadow: "shadow-yellow-500/20"
    },
    { 
      name: "Pending Reviews", 
      value: pendingReviews || 0, 
      icon: TrendingUp, 
      color: "from-red-600 to-red-400",
      shadow: "shadow-red-500/20"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-12 lg:mt-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium mt-1">
            Welcome back to HK Metal House Admin Panel • {format(new Date(), "MMMM do, yyyy")}
          </p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-[#0B3D91] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#0A3A7A] transition-all shadow-[0_8px_20px_rgba(11,61,145,0.2)] flex items-center justify-center gap-2 active:scale-95"
        >
          Add Product
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-white p-4 sm:p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg shrink-0`}>
              <stat.icon size={24} className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-black text-[#64748B] uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-1">{stat.name}</p>
              <p className="text-2xl sm:text-3xl font-black text-[#0F172A]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recently Added Products */}
        <div className="lg:col-span-7 bg-white p-8 rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Recently Added Products</h2>
            <Link href="/admin/products" className="text-[#0B3D91] font-bold text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentProducts?.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition-colors border border-transparent hover:border-gray-100 group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {product.primary_image ? (
                      <img src={product.primary_image} alt={product.name} className="h-full w-full object-contain" />
                    ) : (
                      <Package size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{product.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                    product.active ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}>
                    {product.active ? "Active" : "Inactive"}
                  </span>
                  <p className="text-[10px] font-bold text-gray-400">{format(new Date(product.created_at), "MMM d, yyyy")}</p>
                </div>
              </div>
            ))}
            {(!recentProducts || recentProducts.length === 0) && (
              <div className="text-center py-12">
                <Package className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-[#64748B] font-medium">No products added yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Summary */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="bg-gradient-to-br from-[#0B3D91] to-[#0A3A7A] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group flex-1">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <MessageSquare className="text-[#D4AF37]" size={28} />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">Manage Your Business</h3>
              <p className="text-blue-100/80 text-sm font-medium leading-relaxed mb-8">
                Control your catalog, respond to customer quote requests, and keep your business information up to date.
              </p>
              <div className="space-y-3 mt-auto">
                <Link 
                  href="/admin/products" 
                  className="block w-full bg-[#D4AF37] text-[#0B3D91] py-4 rounded-2xl text-center font-black text-sm hover:bg-[#C4A030] transition-all shadow-lg active:scale-95"
                >
                  Manage Product Catalog
                </Link>
                <Link 
                  href="/admin/inquiries" 
                  className="block w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl text-center font-black text-sm transition-all border border-white/10 active:scale-95"
                >
                  View Customer Inquiries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
