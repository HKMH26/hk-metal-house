"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Search, 
  Trash2, 
  Eye, 
  MessageSquare, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Package, 
  Calendar,
  Loader2,
  X,
  Download,
  Plus
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Inquiry deleted successfully");
      setInquiries(inquiries.filter(i => i.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Status updated to ${status}`);
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
      if (selectedInquiry?.id === id) setSelectedInquiry({ ...selectedInquiry, status });
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Customer", "Company", "Email", "Phone", "Product", "Quantity", "Status", "Message"];
    const rows = inquiries.map(i => [
      format(new Date(i.created_at), "yyyy-MM-dd HH:mm"),
      i.customer_name,
      i.company_name || "",
      i.email,
      i.phone || "",
      i.product_name || "",
      i.quantity || "",
      i.status,
      i.message || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inquiries_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInquiries = inquiries.filter(i => 
    i.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.product_name && i.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inquiries</h1>
          <p className="text-gray-500 mt-2">Manage customer quote requests and messages.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="bg-white text-gray-700 px-6 py-3 rounded-lg font-bold border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <Download size={20} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-gray-500 font-medium">Loading inquiries...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="mx-auto text-gray-200 mb-4" size={64} />
              <h3 className="text-xl font-bold text-gray-800">No inquiries found</h3>
              <p className="text-gray-500">Try adjusting your search.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{inquiry.customer_name}</span>
                            <span className="text-sm text-gray-500">{inquiry.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {inquiry.product_name || "General Inquiry"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                          {format(new Date(inquiry.created_at), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            inquiry.status === 'New' ? 'bg-blue-100 text-blue-700' : 
                            inquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setSelectedInquiry(inquiry)}
                              className="p-2 text-gray-400 hover:text-primary transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(inquiry.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked layout */}
              <div className="md:hidden flex flex-col gap-3 p-4 bg-[#F8FAFC]">
                {filteredInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] flex flex-col gap-3 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[#0F172A] text-sm">{inquiry.customer_name}</h3>
                        <p className="text-[11px] text-[#64748B] mb-1">{inquiry.email}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inquiry.status === 'New' ? 'bg-blue-100 text-blue-700' : 
                        inquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-[#64748B]" />
                        <span className="text-xs font-semibold text-[#0F172A] truncate">{inquiry.product_name || "General Inquiry"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#64748B]" />
                        <span className="text-xs text-[#64748B]">{format(new Date(inquiry.created_at), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end border-t border-[#E2E8F0] pt-3 mt-1">
                      <button onClick={() => setSelectedInquiry(inquiry)} className="flex-1 flex justify-center items-center gap-1.5 p-2 bg-gray-50 hover:bg-gray-100 text-[#0F172A] rounded-xl text-xs font-bold transition-colors">
                        <Eye size={14} /> View Details
                      </button>
                      <button onClick={() => handleDelete(inquiry.id)} className="flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)} />
          
          <div className="bg-white shadow-2xl w-full max-w-[400px] max-h-[85dvh] rounded-[20px] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center shrink-0">
              <h3 className="text-[16px] font-bold text-[#0F172A]">Inquiry Details</h3>
              <button onClick={() => setSelectedInquiry(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-[#64748B] hover:bg-gray-200 hover:text-[#0F172A] transition-colors shrink-0">
                <X size={16} />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="bg-white flex-1 overflow-y-auto p-4 space-y-3">
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 bg-[#F0F5FA] rounded-[8px] text-[#0A4DA3] flex items-center justify-center border border-[#EBF4FF]">
                  <User size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Company / Customer</p>
                  <p className="text-[13px] font-semibold text-[#1E293B] break-words leading-tight">{selectedInquiry.customer_name} {selectedInquiry.company_name ? `(${selectedInquiry.company_name})` : ''}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 bg-[#F0F5FA] rounded-[8px] text-[#0A4DA3] flex items-center justify-center border border-[#EBF4FF]">
                  <Mail size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Email</p>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-[13px] font-medium text-[#0A4DA3] break-words leading-tight hover:underline">{selectedInquiry.email}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 bg-[#F0F5FA] rounded-[8px] text-[#0A4DA3] flex items-center justify-center border border-[#EBF4FF]">
                  <Phone size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Phone</p>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-[13px] font-medium text-[#0A4DA3] break-words leading-tight hover:underline">{selectedInquiry.phone || "N/A"}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 bg-[#FFFBEB] rounded-[8px] text-[#D4AF37] flex items-center justify-center border border-[#FEF3C7]">
                  <Package size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Product</p>
                  <p className="text-[13px] font-semibold text-[#1E293B] break-words leading-tight">{selectedInquiry.product_name || "General Inquiry"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 bg-[#F0F5FA] rounded-[8px] text-[#0A4DA3] flex items-center justify-center border border-[#EBF4FF]">
                  <Calendar size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Date Received</p>
                  <p className="text-[13px] font-medium text-[#1E293B] break-words leading-tight">{format(new Date(selectedInquiry.created_at), "MMMM d, yyyy HH:mm")}</p>
                </div>
              </div>

              {/* Message Block */}
              <div className="pt-1">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-[10px]">
                  <p className="text-[#334155] italic text-[12px] leading-relaxed">"{selectedInquiry.message || "No message provided."}"</p>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer inside Modal */}
            <div className="p-3 border-t border-[#E2E8F0] bg-gray-50/50 shrink-0 rounded-b-[20px] flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-1.5">
                {['New', 'Contacted', 'Closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedInquiry.id, status)}
                    className={`h-[36px] rounded-[8px] font-semibold text-[12px] tracking-tight transition-all ${
                      selectedInquiry.status === status 
                        ? 'bg-[#0A4DA3] text-white shadow-sm' 
                        : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-gray-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handleDelete(selectedInquiry.id)}
                className="h-[36px] w-full rounded-[8px] bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[13px] transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
