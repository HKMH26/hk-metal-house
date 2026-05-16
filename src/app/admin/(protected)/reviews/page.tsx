"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Search, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Star, 
  User, 
  Building2, 
  Mail, 
  Package, 
  Calendar,
  Loader2,
  X,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select(`
        *,
        products (name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("product_reviews")
      .update({ approved: true })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Review approved successfully");
      setReviews(reviews.map(r => r.id === id ? { ...r, approved: true } : r));
      if (selectedReview?.id === id) setSelectedReview({ ...selectedReview, approved: true });
    }
  };

  const handleUnapprove = async (id: string) => {
    const { error } = await supabase
      .from("product_reviews")
      .update({ approved: false })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Review unapproved successfully");
      setReviews(reviews.map(r => r.id === id ? { ...r, approved: false } : r));
      if (selectedReview?.id === id) setSelectedReview({ ...selectedReview, approved: false });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    const { error } = await supabase.from("product_reviews").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Review deleted successfully");
      setReviews(reviews.filter(r => r.id !== id));
      if (selectedReview?.id === id) setSelectedReview(null);
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.review_title && r.review_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.products?.name && r.products.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "approved" && r.approved) || 
      (statusFilter === "pending" && !r.approved);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Product Reviews</h1>
          <p className="text-gray-500 mt-2">Moderate and manage customer feedback.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by customer, title or product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white appearance-none min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-gray-500 font-medium">Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-20">
              <Star className="mx-auto text-gray-200 mb-4" size={64} />
              <h3 className="text-xl font-bold text-gray-800">No reviews found</h3>
              <p className="text-gray-500">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredReviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{review.customer_name}</span>
                            <span className="text-xs text-gray-400">{review.email || "No email"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                          {review.products?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={14} className={review.rating >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            review.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {review.approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setSelectedReview(review)}
                              className="p-2 text-gray-400 hover:text-primary transition-colors"
                            >
                              <Calendar size={18} />
                            </button>
                            {review.approved ? (
                              <button 
                                onClick={() => handleUnapprove(review.id)}
                                className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                                title="Unapprove"
                              >
                                <XCircle size={18} />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleApprove(review.id)}
                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(review.id)}
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
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] flex flex-col gap-3 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[#0F172A] text-sm">{review.customer_name}</h3>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} className={review.rating >= s ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-200"} />
                          ))}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        review.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {review.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="text-xs font-semibold text-[#0F172A] block truncate">{review.products?.name}</span>
                      <span className="text-[10.5px] text-[#64748B] block truncate italic mt-1">&quot;{review.review_title || (review.review_text && review.review_text.length > 30 ? review.review_text.substring(0, 30) + "..." : review.review_text)}&quot;</span>
                    </div>

                    <div className="flex gap-2 justify-end border-t border-[#E2E8F0] pt-3 mt-1">
                      <button onClick={() => setSelectedReview(review)} className="flex-1 flex justify-center items-center gap-1.5 p-2 bg-gray-50 hover:bg-gray-100 text-[#0F172A] rounded-xl text-xs font-bold transition-colors">
                        <Calendar size={14} /> Details
                      </button>
                      
                      {review.approved ? (
                        <button onClick={() => handleUnapprove(review.id)} className="flex items-center justify-center p-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-xl transition-colors shrink-0" title="Unapprove">
                          <XCircle size={16} />
                        </button>
                      ) : (
                        <button onClick={() => handleApprove(review.id)} className="flex items-center justify-center p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors shrink-0" title="Approve">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(review.id)} className="flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors shrink-0" title="Delete">
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

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-sm" onClick={() => setSelectedReview(null)} />
          
          <div className="bg-white shadow-2xl w-full max-w-[400px] max-h-[85dvh] rounded-[20px] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center shrink-0">
              <h3 className="text-[16px] font-bold text-[#0F172A]">Review Details</h3>
              <button onClick={() => setSelectedReview(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-[#64748B] hover:bg-gray-200 hover:text-[#0F172A] transition-colors shrink-0">
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
                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Customer</p>
                  <p className="text-[13px] font-semibold text-[#1E293B] break-words leading-tight">{selectedReview.customer_name} {selectedReview.company_name ? `(${selectedReview.company_name})` : ''}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 bg-[#F0F5FA] rounded-[8px] text-[#0A4DA3] flex items-center justify-center border border-[#EBF4FF]">
                  <Mail size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Email</p>
                  <a href={`mailto:${selectedReview.email}`} className="text-[13px] font-medium text-[#0A4DA3] break-words leading-tight hover:underline">{selectedReview.email || "N/A"}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 bg-[#FFFBEB] rounded-[8px] text-[#D4AF37] flex items-center justify-center border border-[#FEF3C7]">
                  <Package size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Product</p>
                  <p className="text-[13px] font-semibold text-[#1E293B] break-words leading-tight">{selectedReview.products?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 bg-[#F0F5FA] rounded-[8px] text-[#0A4DA3] flex items-center justify-center border border-[#EBF4FF]">
                  <Star size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Rating</p>
                  <div className="flex gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={13} className={selectedReview.rating >= s ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 bg-[#F0F5FA] rounded-[8px] text-[#0A4DA3] flex items-center justify-center border border-[#EBF4FF]">
                  <Calendar size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Date Submitted</p>
                  <p className="text-[13px] font-medium text-[#1E293B] break-words leading-tight">{format(new Date(selectedReview.created_at), "MMMM d, yyyy HH:mm")}</p>
                </div>
              </div>
              
              {/* Message Block */}
              <div className="pt-1">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-[10px]">
                  {selectedReview.review_title && (
                    <h4 className="font-semibold text-[#1E293B] text-[13px] border-b border-[#E2E8F0]/80 pb-2 mb-2">{selectedReview.review_title}</h4>
                  )}
                  <p className="text-[#334155] italic text-[12px] leading-relaxed">"{selectedReview.review_text}"</p>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer inside Modal */}
            <div className="p-3 border-t border-[#E2E8F0] bg-gray-50/50 shrink-0 rounded-b-[20px] flex flex-col gap-2">
               <div className="grid grid-cols-1">
                {selectedReview.approved ? (
                  <button 
                    onClick={() => handleUnapprove(selectedReview.id)}
                    className="h-[36px] rounded-[8px] font-semibold text-[12px] tracking-tight transition-all bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100 flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={14} /> Unapprove Review
                  </button>
                ) : (
                  <button 
                    onClick={() => handleApprove(selectedReview.id)}
                    className="h-[36px] rounded-[8px] font-semibold text-[12px] tracking-tight transition-all bg-[#0A4DA3] text-white shadow-sm hover:bg-[#083B7A] flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={14} /> Approve Review
                  </button>
                )}
               </div>
              <button 
                onClick={() => handleDelete(selectedReview.id)}
                className="h-[36px] w-full rounded-[8px] bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[13px] transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} /> Delete Review
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
