"use client";

import { useState, useEffect } from "react";
import { Star, StarHalf, Send } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  customerName: string;
  createdAt: string;
}

export default function ProductReviews({ productId, storeSlug }: { productId: string; storeSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ customerName: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/store/${storeSlug}/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/store/${storeSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, productId }),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ customerName: "", rating: 5, comment: "" });
        fetchReviews();
      }
    } catch (e) { console.error(e); }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const reviewCount = reviews.length;

  const renderStars = (rating: number, size = 16) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} className={i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
      ))}
    </div>
  );

  return (
    <div className="mt-16 pt-10 border-t border-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="font-black uppercase tracking-widest text-sm">Customer Reviews</h3>
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 text-xs font-bold">
            {renderStars(Math.round(avgRating))}
            <span className="text-slate-400">({reviewCount})</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">Loading...</div>
      ) : reviews.length === 0 && !submitted ? (
        <div className="border border-dashed border-slate-200 rounded-[1.5rem] p-10 text-center mb-10">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto">
          {reviews.map(review => (
            <div key={review.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-black">{review.customerName}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              {review.comment && <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <p className="text-green-700 font-black uppercase tracking-widest text-xs">Thank you for your review!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-5 shadow-sm">
          <h4 className="text-xs font-black uppercase tracking-widest">Write a Review</h4>
          <div>
            <input
              required placeholder="Your Name"
              value={form.customerName}
              onChange={e => setForm({ ...form, customerName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-slate-900 transition-all text-sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} type="button" onClick={() => setForm({ ...form, rating: i })}>
                    <Star size={20} className={i <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 hover:text-amber-300'} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <textarea
              placeholder="Share your experience (optional)"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-slate-900 transition-all text-sm resize-none"
            />
          </div>
          <button type="submit" disabled={submitting} className="bg-slate-900 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all disabled:opacity-50 flex items-center gap-2">
            <Send size={14} /> {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
