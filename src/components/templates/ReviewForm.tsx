"use client";

import { useState } from "react";
import { submitClientReview } from "@/app/store/actions";
import { Star, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ReviewForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    const result = await submitClientReview(slug, name.trim(), role.trim(), content.trim());

    if (result?.error) {
      setStatus("error");
      setErrorMsg(result.error);
    } else {
      setStatus("success");
      setName("");
      setRole("");
      setContent("");
      setRating(5);
    }
  };

  if (status === "success") {
    return (
      <div className="mt-8 max-w-xl mx-auto text-center bg-white/[0.03] border border-green-500/20 rounded-[2rem] p-12 animate-in fade-in zoom-in-95 duration-500">
        <CheckCircle2 className="w-14 h-14 mx-auto mb-5 text-green-400" />
        <h3 className="text-white text-xl font-black uppercase tracking-tight mb-2">Thank You!</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">Your review has been submitted and will appear shortly.</p>
        <button
          onClick={() => setStatus("idle")}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
        >
          Write Another Review
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-slate-500 text-xs font-black uppercase tracking-[0.25em] whitespace-nowrap">Share Your Experience</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/[0.07] rounded-[2rem] p-8 md:p-10 space-y-6">
        {/* Star Rating */}
        <div className="flex flex-col items-center gap-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="transition-transform hover:scale-125"
                style={{ color: star <= (hoveredStar || rating) ? 'var(--dynamic-primary, #22d3ee)' : 'rgba(255,255,255,0.1)' }}
              >
                <Star fill="currentColor" size={28} />
              </button>
            ))}
          </div>
        </div>

        {/* Name + Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Your Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Smith"
              className="w-full bg-white/[0.04] border border-white/[0.07] rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm font-medium"
              style={{ '--tw-ring-color': 'var(--dynamic-primary, #22d3ee)' } as any}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Role / Company <span className="text-slate-600">(optional)</span></label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="CEO, Acme Corp"
              className="w-full bg-white/[0.04] border border-white/[0.07] rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm"
              style={{ '--tw-ring-color': 'var(--dynamic-primary, #22d3ee)' } as any}
            />
          </div>
        </div>

        {/* Review content */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Your Review *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Tell us about your experience..."
            rows={4}
            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm leading-relaxed italic resize-none"
            style={{ '--tw-ring-color': 'var(--dynamic-primary, #22d3ee)' } as any}
          />
        </div>

        {/* Error */}
        {status === "error" && (
          <p className="text-rose-400 text-xs font-bold text-center animate-in slide-in-from-top-2 duration-300">
            {errorMsg}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading" || !name.trim() || !content.trim()}
          className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: 'var(--dynamic-primary, #22d3ee)' }}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
}
