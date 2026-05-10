import { createClient } from "@/lib/supabase/server";
import { Package, MessageSquare, Star, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch summary data
  const [
    { count: totalProducts },
    { count: featuredProducts },
    { count: totalInquiries },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("featured", true),
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
  ]);

  // Fetch recent products
  const { data: recentProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { name: "Total Products", value: totalProducts || 0, icon: Package, color: "bg-blue-500" },
    { name: "Featured Products", value: featuredProducts || 0, icon: Star, color: "bg-yellow-500" },
    { name: "Total Inquiries", value: totalInquiries || 0, icon: MessageSquare, color: "bg-green-500" },
    { name: "Active Products", value: totalProducts || 0, icon: TrendingUp, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back to HK Metal House Admin Panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${stat.color} p-4 rounded-xl text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recently Added Products</h2>
          <div className="space-y-4">
            {recentProducts?.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg overflow-hidden">
                    {product.primary_image && (
                      <img src={product.primary_image} alt={product.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
            {(!recentProducts || recentProducts.length === 0) && (
              <p className="text-gray-500 text-center py-8">No products added yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="bg-accent/20 p-6 rounded-full text-primary mb-6">
            <MessageSquare size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Manage Your Business</h3>
          <p className="text-gray-500 max-w-xs mx-auto mb-8">
            You can manage products, view customer inquiries and update site settings from the sidebar.
          </p>
          <div className="flex gap-4">
            <a href="/admin/products" className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary transition-all">
              Manage Products
            </a>
            <a href="/admin/inquiries" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all">
              View Inquiries
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
