"use client";

import { useState } from "react";
import { Star, MessageSquarePlus } from "lucide-react";
import ReviewForm from "@/components/ReviewForm";
import { format } from "date-fns";

interface ReviewsSectionProps {
  productId: string;
  productName: string;
  initialReviews: any[];
}

export default function ReviewsSection({ productId, productName, initialReviews }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  // Use state for reviews in case we want to support optimistic updates or filtering in the future
  const reviews = initialReviews || [];
  
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-16">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Customer Reviews</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={24} 
                    className={`${
                      parseFloat(avgRating) >= star 
                        ? "fill-yellow-400 text-yellow-400" 
                        : parseFloat(avgRating) >= star - 0.5 
                          ? "fill-yellow-400/50 text-yellow-400" 
                          : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900 ml-2">{avgRating}/5</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-200" />
            <p className="text-gray-500 font-medium">Based on {totalReviews} verified client reviews</p>
          </div>
        </div>

        <button 
          onClick={() => setShowForm(true)}
          className="bg-white text-blue-900 border-2 border-blue-900 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/5"
        >
          <MessageSquarePlus size={20} /> Write a Review
        </button>
      </div>

      {/* Reviews Grid */}
      {totalReviews === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <Star className="mx-auto text-gray-200 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Be the first to review this product</h3>
          <p className="text-gray-500 mb-8">Have you used this product? Share your experience with other customers.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="text-blue-900 font-bold hover:underline"
          >
            Click here to submit your review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-6 animate-in fade-in duration-500"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={16} 
                      className={`${review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {format(new Date(review.created_at), "MMM d, yyyy")}
                </span>
              </div>
              
              <div className="space-y-2 flex-1">
                {review.review_title && (
                  <h4 className="font-bold text-blue-900 text-lg">{review.review_title}</h4>
                )}
                <p className="text-gray-600 italic leading-relaxed">"{review.review_text}"</p>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <p className="font-bold text-blue-900">{review.customer_name}</p>
                {review.company_name && (
                  <p className="text-sm text-gray-400 font-medium">{review.company_name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <ReviewForm 
            productId={productId} 
            productName={productName} 
            onClose={() => setShowForm(false)} 
          />
        </div>
      )}
    </div>
  );
}
