"use client";

import { useState, useEffect } from "react";
import { Star, X, Loader2, CheckCircle, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

export default function ReviewForm({ productId, productName, onClose }: ReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    customer_name: "",
    company_name: "",
    email: "",
    review_title: "",
    review_text: ""
  });

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setLoading(true);

    const { error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: productId,
        customer_name: formData.customer_name,
        company_name: formData.company_name,
        email: formData.email,
        rating,
        review_title: formData.review_title,
        review_text: formData.review_text,
        approved: false
      });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid = formData.customer_name && formData.review_text && rating > 0;

  if (submitted) {
    return (
      <div className="bg-white p-12 rounded-[2rem] shadow-2xl w-full max-w-lg text-center animate-in fade-in zoom-in duration-500 border border-gray-100">
        <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
          <CheckCircle className="text-green-500" size={48} />
        </div>
        <h3 className="text-3xl font-bold text-blue-900 mb-4">Thank you!</h3>
        <p className="text-gray-600 mb-10 leading-relaxed text-lg">
          Your review has been submitted successfully and will appear after a quick quality check by our team.
        </p>
        <button 
          onClick={onClose}
          className="w-full bg-blue-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 active:scale-95"
        >
          Close Window
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500 border border-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-5 text-white flex justify-between items-center shadow-lg">
        <div className="space-y-0.5">
          <h3 className="text-lg md:text-xl font-bold truncate max-w-[200px] md:max-w-md">{productName}</h3>
          <p className="text-blue-100 text-xs opacity-90">Share your experience with this product.</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 hover:bg-white/10 rounded-full transition-all active:scale-90"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form id="review-form" onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Rating Section */}
          <div className="flex flex-col items-center gap-3 py-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">How would you rate this product?</p>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-90 p-0.5"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`Rate ${star} stars`}
                >
                  <Star 
                    size={32} 
                    className={`${
                      (hover || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400">1 = Poor, 5 = Excellent</p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-700 ml-1">Full Name *</label>
              <input 
                type="text" 
                name="customer_name"
                required 
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300 bg-white"
                placeholder="e.g. Rajesh Patel"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-700 ml-1">Company Name</label>
              <input 
                type="text" 
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300 bg-white"
                placeholder="e.g. Shree Equipments"
              />
            </div>
            
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-700 ml-1">Email Address (Optional)</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300 bg-white"
                placeholder="e.g. rajesh@example.com"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-700 ml-1">Review Title</label>
              <input 
                type="text" 
                name="review_title"
                value={formData.review_title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300 bg-white"
                placeholder="Summarize your experience..."
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-700 ml-1">Detailed Review *</label>
              <div className="relative">
                <textarea 
                  name="review_text"
                  required 
                  rows={5}
                  value={formData.review_text}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none min-h-[120px] text-sm text-gray-800 placeholder:text-gray-300 bg-white"
                  placeholder="Tell us about the product quality..."
                ></textarea>
                <div className="absolute bottom-3 right-3 text-[10px] font-medium text-gray-300">
                  {formData.review_text.length} chars
                </div>
              </div>
            </div>
          </div>

          {/* Trust Message */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600 shrink-0">
              <Info size={16} />
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
              Your review will be verified by our team and published after approval to maintain professional standards.
            </p>
          </div>
        </form>
      </div>

      {/* Footer Actions */}
      <div className="p-5 md:p-6 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-end gap-3">
        <button 
          type="button"
          onClick={onClose}
          className="px-8 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-all text-sm text-center order-2 md:order-1"
        >
          Cancel
        </button>
        <button 
          type="submit"
          form="review-form"
          disabled={loading || !isFormValid}
          className="bg-blue-900 text-white px-10 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 active:scale-95 order-1 md:order-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Processing...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </div>
  );
}
