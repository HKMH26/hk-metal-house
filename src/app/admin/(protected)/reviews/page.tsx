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
          )}
        </div>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Review Details</h3>
              <button onClick={() => setSelectedReview(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="text-primary mt-1" size={18} />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Customer</p>
                      <p className="font-bold text-gray-800">{selectedReview.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="text-primary mt-1" size={18} />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Company</p>
                      <p className="font-bold text-gray-800">{selectedReview.company_name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="text-primary mt-1" size={18} />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                      <p className="font-bold text-gray-800">{selectedReview.email || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Package className="text-primary mt-1" size={18} />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Product</p>
                      <p className="font-bold text-gray-800">{selectedReview.products?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="text-primary mt-1" size={18} />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Rating</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} className={selectedReview.rating >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="text-primary mt-1" size={18} />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Submitted On</p>
                      <p className="font-bold text-gray-800">{format(new Date(selectedReview.created_at), "MMMM d, yyyy HH:mm")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                {selectedReview.review_title && (
                  <h4 className="font-bold text-gray-800 text-lg border-b border-gray-200 pb-2">{selectedReview.review_title}</h4>
                )}
                <p className="text-gray-600 italic leading-relaxed">"{selectedReview.review_text}"</p>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <div className="flex gap-4">
                  {selectedReview.approved ? (
                    <button 
                      onClick={() => handleUnapprove(selectedReview.id)}
                      className="bg-yellow-100 text-yellow-700 px-6 py-2 rounded-xl font-bold hover:bg-yellow-200 transition-all"
                    >
                      Unapprove
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleApprove(selectedReview.id)}
                      className="bg-green-100 text-green-700 px-6 py-2 rounded-xl font-bold hover:bg-green-200 transition-all"
                    >
                      Approve Review
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(selectedReview.id)}
                    className="bg-red-50 text-red-500 px-6 py-2 rounded-xl font-bold hover:bg-red-100 transition-all"
                  >
                    Delete Permanent
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
