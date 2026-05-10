import { createClient } from "@/lib/supabase/server";
import { Package, MessageSquare, Star, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

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
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight">Dashboard Overview</h1>
          <div className="flex items-center gap-2 mt-2 text-[#64748B] font-medium">
            <Calendar size={16} />
            <p>Welcome back to HK Metal House Admin Panel • {format(new Date(), "MMMM do, yyyy")}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new" className="bg-[#0A3A7A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#082D5F] transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2">
            Add Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5EAF2] flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl text-white ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest">{stat.name}</p>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white p-8 rounded-[2rem] shadow-sm border border-[#E5EAF2]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#0F172A]">Recently Added Products</h2>
            <Link href="/admin/products" className="text-[#0A3A7A] font-bold text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-5">
            {recentProducts?.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100/50 hover:border-[#0A3A7A]/20 hover:bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 bg-white rounded-xl overflow-hidden border border-gray-100 p-1 flex items-center justify-center shrink-0">
                    {product.primary_image ? (
                      <img src={product.primary_image} alt={product.name} className="h-full w-full object-contain" />
                    ) : (
                      <Package size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A] text-lg leading-none">{product.name}</p>
                    <p className="text-sm text-[#64748B] mt-1.5 font-medium">{product.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                  <p className="text-[10px] text-gray-400 font-medium">{format(new Date(product.created_at), "MMM d")}</p>
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

        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="bg-[#0A3A7A] p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group flex-1">
            {/* Watermark Logo */}
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <img src="/images/hk-metal-house-logo.png" alt="" className="w-64 h-64 object-contain invert" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <MessageSquare className="text-[#F4B400]" size={32} />
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-4">Manage Your Business</h3>
              <p className="text-blue-100/80 leading-relaxed mb-10 font-medium">
                Control your catalog, respond to customer quote requests, and keep your business information up to date.
              </p>
              <div className="flex flex-col gap-4 mt-auto">
                <Link href="/admin/products" className="bg-[#F4B400] text-[#0A3A7A] py-4 rounded-xl font-bold text-center hover:bg-white hover:scale-[1.02] transition-all shadow-xl shadow-yellow-500/10">
                  Manage Product Catalog
                </Link>
                <Link href="/admin/inquiries" className="bg-white/10 text-white py-4 rounded-xl font-bold text-center border border-white/20 hover:bg-white/20 transition-all">
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
